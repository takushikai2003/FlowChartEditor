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

        // // そのエッジを消す
        const edgeIndex = state_copy.edges.indexOf(edge);
        // if(edgeIndex !== -1) {
        //     state_copy.edges.splice(edgeIndex, 1);
        // }

        // console.log(edge.to);
        const nowNodeDom = getNodeDomByfromId(fromId); // そのエッジのfromポイントを探す
        const nowNode = state.nodes.find(node => node.id === nowNodeDom.dataset.id);

        const nextNodeDom = getNodeDomBytoId(edge.to); // そのエッジのtoポイントを探す
        const nextNode = state.nodes.find(node => node.id === nextNodeDom.dataset.id);
        code += `${nextNodeDom.dataset.type}\n`;

        if(nextNode.type === 'start'){
            console.error("Start node reached, this should not happen.");
            return null;
        }
        else if(nextNode.type === 'end'){
            console.log("End node reached.");

            let syntactError = false;
            if (loop_stack.length > 0) {
                syntactError = true;
                console.error(`ループの終了が見つかっていない [loop_start] が ${loop_stack.length} 件あります`);
                loop_stack.forEach(loop => {
                    console.error(`未終了ループ: 開始ノードID = ${loop.fromId}`);
                });
            }

            console.log("実行が終了しました。");

            if (syntactError) {
                return false;
            }
            return true;
        }
        // else if(nextNode.type === 'io') {
        //     // 入出力ノードの場合は、何もしない
        //     const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
        //     eatToken(fromId);
        // }
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

            const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
            loop_stack.push({ remaining: nextNode.data.loop_count, fromId: fromId });

            eatToken(fromId);
        }
        else if(nextNode.type === 'loop_end') {
            if (loop_stack.length === 0) {
                console.warn(`対応する [loop_start] が見つかりません（loop_end: ${nextNode.id}）`);
                return false;
            }
            const top = loop_stack[loop_stack.length - 1];
            top.remaining -= 1;
            if (top.remaining > 0) {
                eatToken(top.fromId); // ループ先頭に戻る
            } else {
                loop_stack.pop(); // ループ終了
                const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
                eatToken(fromId); // ループ終了後のノードへ進む
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


function getNodeDomByfromId(from){
    // そのエッジのfromポイントを探す
    const fromPoint = document.querySelector(`[data-id="${from}"]`);

    return fromPoint.closest('.node');
}