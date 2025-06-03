'use strict';
import { state } from '../var.js';

export function run() {
    // まずはstateをコピーしておく(state.edgeを削除するため)
    // state.nodesはfnの情報を持っているので、そこから必要な情報を取得する
    const state_copy = JSON.parse(JSON.stringify(state));

    const loop_stack = [];

    const startNode = state_copy.nodes.find(node => node.type === 'start');
    const startNodeEl = document.querySelector(`.node[data-id="${startNode.id}"]`);
    const startNodefromId = startNodeEl.querySelector('.from-point').dataset.id;

    let code = '';
    code += "start\n";


    function eatToken(fromId){
        const edge = state_copy.edges.find(edge => edge.from === fromId);
        if(!edge) return null;
        const edgeIndex = state_copy.edges.indexOf(edge);
        // そのエッジを消す
        if(edgeIndex !== -1) {
            state_copy.edges.splice(edgeIndex, 1);
        }

        // console.log(edge.to);
        const nextNodeDom = getNodeDomBytoId(edge.to); // そのエッジのtoポイントを探す

        code += `${nextNodeDom.dataset.type}\n`;
        // console.log(nextNodeDom.dataset.type);
        // ノードに紐づけられた内容を表示
        const nextNode = state.nodes.find(node => node.id === nextNodeDom.dataset.id);

        if(nextNode.type === 'start'){
            console.error("Start node reached, this should not happen.");
            return null;
        }
        else if(nextNode.type === 'end'){
            console.log("End node reached.");
            console.log("実行が完了しました。");
            return true;
        }
        else if(nextNode.type === 'io') {
            // 入出力ノードの場合は、何もしない
            const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
            eatToken(fromId);
        }
        else if(nextNode.type === 'process') {
            // 処理ノードの場合は、fnを実行する
            const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
            if(nextNode?.data.fn){
                // fnがあれば実行する
                const fn = nextNode.data.fn;
                if (typeof fn === 'function') {
                    try {
                        fn();
                    } catch (error) {
                        console.error("Error executing function:", error);
                    }
                } else {
                    console.warn("No function found for node:", nextNode.id);
                }
            }
            else{
                console.error("No function found for process node:", nextNode.id);
            }
            eatToken(fromId);
        }
        else if(nextNode.type === 'loop_start') {
            // ループ開始ノードの場合は、ループスタックに追加
            loop_stack.push(nextNode);
            const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
            eatToken(fromId);
        }
        else if(nextNode.type === 'loop_end') {
            // ループ終了ノードの場合は、ループスタックからポップして、ループ開始ノードに戻る
            if(loop_stack.length > 0) {
                const loopStartNode = loop_stack.pop();
                const fromId = loopStartNode.el.querySelector('.from-point').dataset.id;
                eatToken(fromId);
            } else {
                console.error("Loop end reached without a matching loop start.");
            }
        }
        else if(nextNode.type === 'decision') {
            // 分岐ノードの場合は、yes/noのエッジを処理する
            // 条件関数の実行
            let conditionResult;
            if(nextNode?.data.fn){
                // fnがあれば実行する
                const fn = nextNode.data.fn;
                if (typeof fn === 'function') {
                    try {
                        conditionResult = fn();
                    } catch (error) {
                        console.error("Error executing function:", error);
                    }
                } else {
                    console.warn("No function found for node:", nextNode.id);
                }
            }
            else{
                console.error("No function found for decision node:", nextNode.id);
            }

            // 条件結果に応じて、yes/noのエッジを選択
            const fromId = conditionResult ? 
            nextNodeDom.querySelector('.from-point-yes').dataset.id 
            :
            nextNodeDom.querySelector('.from-point-no').dataset.id;

            eatToken(fromId);
        }
        else {
            console.error("Unknown node type:", nextNode.type);
        }
    }


    eatToken(startNodefromId);
    console.log(code);
}


function getNodeDomBytoId(toId){
    // toがedgeなら、その先のNodeを探す
    if(toId.includes("line-group")){
        // toId = toId.slice(-23);
        // to-pointから始まる後ろのidを取得
        toId = toId.match(/to-point-\d+/g);
    }

    // そのエッジのtoポイントを探す
    const toPoint = document.querySelector(`[data-id="${toId}"]`);

    return toPoint.closest('.node');
}