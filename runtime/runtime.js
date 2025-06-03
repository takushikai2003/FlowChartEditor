'use strict';
import { state } from '../var.js';

export function run() {
    // まずはstateをコピーしておく(state.edgeを削除するため)
    // state.nodesはfnの情報を持っているので、そこから必要な情報を取得する
    const state_copy = JSON.parse(JSON.stringify(state));

    const loop_stacks = [];

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
            console.log("実行が完了しました。");
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


            // ループ開始ノードの場合は、ループスタックに追加
            // ループ回数-1回分追加する（一回分はすぐに実行されるため）
            const loop_stack = [];
            for(let i = 0; i < nextNode.data.loop_count -1; i++){
                // ループスタックに追加
                console.log("loop push", fromId);
                loop_stack.push(fromId);
            }

            loop_stacks.push(loop_stack);
            
            eatToken(fromId);
        }
        else if(nextNode.type === 'loop_end') {
            // ループ終了ノードの場合は、ループスタックからポップして、ループ開始ノードに戻る
            if(loop_stacks.length > 0) {
                console.log("loop pop")
                const loop_stack = loop_stacks.pop();
                // ループスタックが空でない場合は、最後のfromIdを取得してループ開始ノードに戻る
                const fromId = loop_stack.pop();

                // ループスタックがまだ残っている場合は戻す
                if(loop_stack.length > 0) {
                    console.log("loop stack not empty, continue loop");
                    loop_stacks.push(loop_stack);
                }
                eatToken(fromId);
            }
            // ループスタックが空の場合は、ループを終了して次のノードに進む
            else{
                const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
                eatToken(fromId);
            }
            // else {
            //     console.error("Loop end reached without a matching loop start.");
            // }
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