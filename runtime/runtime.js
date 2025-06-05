'use strict';
import { state } from '../var.js';
import { showModal } from '../modal.js';
import { moveUp, moveDown, moveRight, moveLeft, isWallUp, isWallDown, isWallRight, isWallLeft } from "../stage/stage_main.js";

export const runtime ={
    run: run,
    stop: stop,
    state: "running"
}

let stopFlg = false; // 実行を停止するフラグ
function stop() {
    stopFlg = true;
    console.log("実行を停止しました。");
}


function nodeFunctionRunner(fnName) {
    // ノードの関数を実行する
    switch(fnName) {
        case 'moveUp':
            moveUp();
            break;
        case 'moveDown':
            moveDown();
            break;
        case 'moveRight':
            moveRight();
            break;
        case 'moveLeft':
            moveLeft();
            break;
        case 'isWallUp':
            return isWallUp();
        case 'isWallDown':
            return isWallDown();
        case 'isWallRight':
            return isWallRight();
        case 'isWallLeft':
            return isWallLeft();
        default:
            console.error(`Unknown function name: ${fnName}`);
            return false; // デフォルトはfalseを返す
    }
}



// speed: 1ステップにかかる時間(ms)
// 0の場合は、すぐに実行する
async function run(speed=100) {
    // まずはstateをコピーしておく(state.edgeを削除するため)
    // state.nodesはfnの名前情報を持っているので、そこから必要な情報を取得する
    const state_copy = JSON.parse(JSON.stringify(state));

    const loop_stack = [];

    const startNode = state_copy.nodes.find(node => node.type === 'start');
    const startNodeEl = document.querySelector(`.node[data-id="${startNode.id}"]`);
    const startNodefromId = startNodeEl.querySelector('.from-point').dataset.id;

    let code = '';
    code += "start\n";

    let success = false;

    stopFlg = false; // 実行を停止するフラグをリセット
    runtime.state = "running"; // 実行状態をリセット
    // すべての.node-emphasis クラスを削除
    const emphasizedNodes = document.querySelectorAll('.node-emphasis');
    emphasizedNodes.forEach(shape => {
        shape.classList.remove("node-emphasis");
    });


    async function eatToken(fromId){
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
        // 実行中のノードを強調表示する
        nowNodeDom.querySelector(".shape").classList.add("node-emphasis");
        await wait(speed);
        if(stopFlg) {
            runtime.state = "stopped"; // 実行状態を停止に変更
            return false; // 実行を停止する
        }


        const nextNodeDom = getNodeDomBytoId(edge.to); // そのエッジのtoポイントを探す
        const nextNode = state.nodes.find(node => node.id === nextNodeDom.dataset.id);
        code += `${nextNodeDom.dataset.type}\n`;

        if(nextNode.type === 'start'){
            console.error("Start node reached, this should not happen.");
            runtime.state = "failed"; // 実行状態を失敗に変更
            return false; // 開始ノードに戻ることはないはずなので、エラーを返す
        }
        else if(nextNode.type === 'end'){
            console.log("End node reached.");

            let syntactError = false;
            if (loop_stack.length > 0) {
                syntactError = true;
                console.error(`ループの終了が見つかっていない [loop_start] が ${loop_stack.length} 件あります`);

                const div = document.createElement("div");
                div.innerHTML = `<p style="color:red">[ループ終端]と対応していない [ループ始端] が ${loop_stack.length} 個あります。</p>`;

                showModal("構造エラー", div);


                loop_stack.forEach(loop => {
                    console.error(`未終了ループ: 開始ノードID = ${loop.fromId}`);
                });
            }

            console.log("実行が終了しました。");

             // 強調表示を解除する
            nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");

            // 次のノードを強調表示する
            nextNodeDom.querySelector(".shape").classList.add("node-emphasis");
            await wait(speed);
            // 強調表示を解除する
            nextNodeDom.querySelector(".shape").classList.remove("node-emphasis");

            if (syntactError) {
                runtime.state = "failed"; // 実行状態を失敗に変更
                return false;
            }
            success = true;

            // 実行が成功した場合の処理
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
            if(nextNode?.data.fnName){
                // fnがあれば実行する
                const fnName = nextNode.data.fnName;
                nodeFunctionRunner(fnName);
            }
            else{
                console.error("No function found for process node:", nextNode.id);
            }
            // 強調表示を解除する
            nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");
            eatToken(fromId);
        }
        else if(nextNode.type === 'loop_start') {

            const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
            loop_stack.push({ remaining: nextNode.data.loop_count, fromId: fromId });

            // 強調表示を解除する
            nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");
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
                 // 強調表示を解除する
                nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");

                // ループエンドブロックを強調表示する
                nextNodeDom.querySelector(".shape").classList.add("node-emphasis");
                await wait(speed);
                // 強調表示を解除する
                nextNodeDom.querySelector(".shape").classList.remove("node-emphasis");

                eatToken(top.fromId); // ループ先頭に戻る
            }
            else {
                loop_stack.pop(); // ループ終了
                const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
                // 強調表示を解除する
                nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");

                // ループエンドブロックを強調表示する
                nextNodeDom.querySelector(".shape").classList.add("node-emphasis");
                await wait(speed);
                // 強調表示を解除する
                nextNodeDom.querySelector(".shape").classList.remove("node-emphasis");

                eatToken(fromId); // ループ終了後のノードへ進む
            }
        }
        else if(nextNode.type === 'decision') {
            // 分岐ノードの場合は、yes/noのエッジを処理する
            // 条件関数の実行
            let conditionResult;
            if(nextNode?.data.fnName){
                // fnがあれば実行する
                const fnName = nextNode.data.fnName;
                conditionResult = nodeFunctionRunner(fnName);
            }
            else{
                console.error("No function found for decision node:", nextNode.id);
            }

            // 条件結果に応じて、yes/noのエッジを選択
            const fromId = conditionResult ? 
            nextNodeDom.querySelector('.from-point-yes').dataset.id 
            :
            nextNodeDom.querySelector('.from-point-no').dataset.id;

             // 強調表示を解除する
            nowNodeDom.querySelector(".shape").classList.remove("node-emphasis");
            eatToken(fromId);
        }
        else {
            console.error("Unknown node type:", nextNode.type);
        }
    }


    await eatToken(startNodefromId);

    return success;
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


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}