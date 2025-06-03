import { addNode } from "./addNode.js";
import { saveFile, loadFile } from "./fileMagager.js";
import { run } from "./runtime/runtime.js";
import { showModal } from "./modal.js";
import { process_kinds, decision_kinds, loop_start_kinds } from "./data/nodeKinds.js";


// document.getElementById("add_start")
// .addEventListener("click", () => addNode('start'));
// document.getElementById("add_end")
// .addEventListener("click", () => addNode('end'));
// document.getElementById("add_io")
// .addEventListener("click", () => addNode('io'));

// 処理ノード
document.getElementById("add_process")
.addEventListener("click", () => {
    const node = addNode('process');
    // nodeの初期値を設定
    const defaultProcess = process_kinds.find(kind => kind.default);
    node.updateLabel(defaultProcess.label);
    node.setData("fn", defaultProcess.fn);

    
    node.el.addEventListener("dblclick",async  () => {
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
                node.setData("fn", selectedKind.fn);
            }
            else {
                console.error("選択された処理が見つかりません:", select.value);
            }
        });

        await showModal("処理の内容", pr);
    });
});

// 分岐ノード
document.getElementById("add_decision")
.addEventListener("click", () => {
    const node = addNode('decision');
    // nodeの初期値を設定
    const defaultDecision = decision_kinds.find(kind => kind.default);
    node.updateLabel(defaultDecision.label);
    node.setData("fn", defaultDecision.fn);


    node.el.addEventListener("dblclick",async  () => {
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
                node.setData("fn", selectedKind.fn);
            }
            else {
                console.error("選択された分岐が見つかりません:", select.value);
            }
        });

        await showModal("分岐条件", pr);
    });

});

// ループ開始ノード
document.getElementById("add_loop_start")
.addEventListener("click", () => {
    const node = addNode('loop_start');
    node.el.addEventListener("dblclick",async  () => {
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
            // console.log("ループ回数:", node.getData("loop_count"));
        });

        await showModal("ループ回数", pr);
    });
});
document.getElementById("add_loop_end")
.addEventListener("click", () => addNode('loop_end'));

document.getElementById("run")
.addEventListener("click", () => {
    run();
});

// document.getElementById("save_file")
// .addEventListener("click", () => {
//     saveFile();
// });
// document.getElementById("load_file")
// .addEventListener("change", (event) => {
//     loadFile(event);
// });


// 開始・終了ノードは自動的に追加
addNode('start', 100, 30);
addNode('end', 100, 300);