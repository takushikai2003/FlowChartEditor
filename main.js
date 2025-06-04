import { addNode, bindNodeEvents } from "./addNode.js";
import { saveFile, loadFile } from "./fileMagager.js";
import { runtime } from "./runtime/runtime.js";
import { showModal } from "./modal.js";
import { process_kinds, decision_kinds, loop_start_kinds } from "./data/nodeKinds.js";
import { stageInit } from "./stage/stage_main.js";
import { random } from "./random.js";
import { loadHistory } from "./history.js";
import { state } from "./var.js";
import { Node } from "./class.js";
import { renderLines } from "./renderLines.js";

const initialState = loadHistory("state");
const initialDom = loadHistory("dom");

console.log("history:", initialState);

// console.log("dom:", initialDom);
if (initialState.nodes || initialState.edges) {
    // まずdomを復元
    if (initialDom) {
        // DOMの復元
        document.getElementById("lines").insertAdjacentHTML("afterend", initialDom);
    }
    
    // 次にノードとエッジを復元
    for(const node of initialState.nodes) {
        const nodeEl = document.querySelector(`[data-id="${node.id}"]`);
        bindNodeEvents(nodeEl); // イベントをバインド

        // ノードを追加
        const newNode = new Node(node.id, node.type, node.label, node.x, node.y, nodeEl);
        newNode.data = node.data || {}; // データを復元
        console.log(node.data)

        switch (node.type) {
            case "process":
                newNode.el.addEventListener("dblclick", () => { onProcessNodeDblClick(newNode); });
                break;
            case "decision":
                newNode.el.addEventListener("dblclick", () => { onDecisionNodeDblClick(newNode); });
                break;
            case "loop_start":
                newNode.el.addEventListener("dblclick", () => { onLoopStartNodeDblClick(newNode); });
                console.log("loop_count:", newNode.getData("loop_count"));
                switch (newNode.getData("loop_count")) {
                    case 1:
                        newNode.updateLabel("1回ループ");
                        break;
                    case 2:
                        newNode.updateLabel("2回ループ");
                        break;
                    case 3:
                        newNode.updateLabel("3回ループ");
                        break;
                    case 4:
                        newNode.updateLabel("4回ループ");
                        break;
                    case 5:
                        newNode.updateLabel("5回ループ");
                        break;
                    case 1000:
                        newNode.updateLabel("ずっとループ");
                        break;

                    default:
                        console.warn("不明なループ回数:", newNode.getData("loop_count"));
                        break;
                }

                break;
            case "loop_end":
                // ループ終了ノードは特にイベントはない
                break;
            default:
                // 他のノードタイプは特にイベントはない
                break;
        }

        state.nodes.push(newNode);
    }

    state.edges = initialState.edges;

    renderLines(); // エッジを再描画
}
else{
    // 開始・終了ノードは自動的に追加
    addNode('start', 100, 30);
    addNode('end', 100, 500);
}



let speed = 500; // 実行速度(ms)

// document.getElementById("add_start")
// .addEventListener("click", () => addNode('start'));
// document.getElementById("add_end")
// .addEventListener("click", () => addNode('end'));
// document.getElementById("add_io")
// .addEventListener("click", () => addNode('io'));



// 処理ノード
document.getElementById("add_process")
.addEventListener("click", () => {
    const node = addNode('process', 100+ random(0, 50), 100 + random(0, 50));
    // nodeの初期値を設定
    const defaultProcess = process_kinds.find(kind => kind.default);
    node.updateLabel(defaultProcess.label);
    node.setData("fnName", defaultProcess.fnName);

    node.el.addEventListener("dblclick", ()=>{onProcessNodeDblClick(node);});
});

// 分岐ノード
document.getElementById("add_decision")
.addEventListener("click", () => {
    const node = addNode('decision', 100+ random(0, 50), 100 + random(0, 50));
    // nodeの初期値を設定
    const defaultDecision = decision_kinds.find(kind => kind.default);
    node.updateLabel(defaultDecision.label);
    node.setData("fnName", defaultDecision.fnName);

    node.el.addEventListener("dblclick", ()=>{onDecisionNodeDblClick(node);});
});

// ループ開始ノード
document.getElementById("add_loop_start")
.addEventListener("click", () => {
    const node = addNode('loop_start', 100+ random(0, 50), 100 + random(0, 50));
    node.el.addEventListener("dblclick", () => {onLoopStartNodeDblClick(node);});
});
document.getElementById("add_loop_end")
.addEventListener("click", () => addNode('loop_end', 100+ random(0, 50), 100 + random(0, 50)));



document.getElementById("run_start")
.addEventListener("click", async () => {
    stageInit(); // ステージを初期化

    runtime.run(speed);
});

document.getElementById("run_stop")
.addEventListener("click", () => {
    runtime.stop();
});

// document.getElementById("save_file")
// .addEventListener("click", () => {
//     saveFile();
// });
// document.getElementById("load_file")
// .addEventListener("change", (event) => {
//     loadFile(event);
// });


document.getElementById("setup")
.addEventListener("click", async () => {
    const pr = document.createElement("div");
    pr.innerHTML = `
    <hr/>
    <h3>スピード</h3>
    `;
    const select = document.createElement("select");
    select.classList.add("modal-select");
    const option1 = document.createElement("option");
    option1.value = 100;
    option1.textContent = "はやい";
    option1.selected = speed === 100;
    select.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = 500;
    option2.textContent = "ふつう";
    option2.selected = speed === 500; // 初期選択
    select.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = 1000;
    option3.textContent = "おそい";
    option3.selected = speed === 1000; // 初期選択
    select.appendChild(option3);
    

    pr.appendChild(select);
    select.addEventListener("change", () => {
        speed = Number(select.value);
    });

    const pr2 = document.createElement("div");
    pr2.innerHTML = `
    <hr/>
    <h3>すべてリセット</h3>
    <span>すべてのノードとエッジを削除し、履歴をリセットします。この操作は取り消せません</span>
    `;
    const resetButton = document.createElement("button");
    resetButton.textContent = "リセット";
    resetButton.addEventListener("click", () => {
        // 確認する
        if (!confirm("本当にリセットしますか？")) {
            return;
        }
        // ノードとエッジを初期化
        state.nodes = [];
        state.edges = [];
        localStorage.removeItem("state"); // 履歴を削除
        localStorage.removeItem("dom"); // DOMを削除
        document.getElementById("canvas").innerHTML = ""; // DOMをクリア

        // リロード
        location.reload();
    });
    pr2.appendChild(resetButton);

    pr.appendChild(pr2);

    await showModal("設定", pr);
});


async function onProcessNodeDblClick(node) {
    const pr = document.createElement("div");
    const select = document.createElement("select");
    select.classList.add("modal-select");

    process_kinds.forEach(kind => {
        const option = document.createElement("option");
        option.value = kind.label;
        option.textContent = kind.label;
        option.selected = node.label === kind.label; // 初期選択
        select.appendChild(option);
    });

    pr.appendChild(select);

    select.addEventListener("change", () => {
        node.updateLabel(select.value);
        const selectedKind = process_kinds.find(kind => kind.label === select.value);
        if (selectedKind) {
            node.setData("fnName", selectedKind.fnName);
        }
        else {
            console.error("選択された処理が見つかりません:", select.value);
        }
    });

    await showModal("処理の内容", pr);
    renderLines(); // ラベル変更後に線を再描画
}


async function onDecisionNodeDblClick(node) {
    const pr = document.createElement("div");
    const select = document.createElement("select");
    select.classList.add("modal-select");

    decision_kinds.forEach(kind => {
        const option = document.createElement("option");
        option.value = kind.label;
        option.textContent = kind.label;
        option.selected = node.label === kind.label; // 初期選択
        select.appendChild(option);
    });

    pr.appendChild(select);

    select.addEventListener("change", () => {
        node.updateLabel(select.value);
        const selectedKind = decision_kinds.find(kind => kind.label === select.value);
        if (selectedKind) {
            node.setData("fnName", selectedKind.fnName);
        }
        else {
            console.error("選択された分岐が見つかりません:", select.value);
        }
    });

    await showModal("分岐条件", pr);
    renderLines(); // ラベル変更後に線を再描画
}


async function onLoopStartNodeDblClick(node) {
    const pr = document.createElement("div");
    const select = document.createElement("select");
    select.classList.add("modal-select");

    loop_start_kinds.forEach(kind => {
        const option = document.createElement("option");
        option.value = kind.value;
        option.textContent = kind.label;
        option.selected = node.label === kind.label; // 初期選択
        select.appendChild(option);
    });

    pr.appendChild(select);
    select.addEventListener("change", () => {
        // 選択されたループ回数をラベルに設定
        node.updateLabel(select.options[select.selectedIndex].textContent);

        // ノードのデータにループ回数を保存
        node.setData("loop_count", Number(select.value));
        // console.log(state);
        // console.log("ループ回数:", node.getData("loop_count"));
    });

    await showModal("ループ回数", pr);
    renderLines(); // ラベル変更後に線を再描画
}