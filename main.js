import { addNode } from "./addNode.js";
import { saveFile, loadFile } from "./fileMagager.js";
import { compile } from "./compiler/compiler.js";
import { showModal } from "./modal.js";


// document.getElementById("add_start")
// .addEventListener("click", () => addNode('start'));
// document.getElementById("add_end")
// .addEventListener("click", () => addNode('end'));
// document.getElementById("add_io")
// .addEventListener("click", () => addNode('io'));

document.getElementById("add_process")
.addEventListener("click", () => {
    const node = addNode('process');
    node.el.addEventListener("dblclick",async  () => {
        const pr = document.createElement("div");
        const input = document.createElement("input");
        input.type = "text";
        input.value = node.label;
        pr.appendChild(input);
        input.addEventListener("change", () => {
            node.updateLabel(input.value);
        });

        await showModal("処理の内容", pr);
    });
});
document.getElementById("add_decision")
.addEventListener("click", () => {
    const node = addNode('decision');
    node.el.addEventListener("dblclick",async  () => {
        const pr = document.createElement("div");
        const input = document.createElement("input");
        input.type = "text";
        input.value = node.label;
        pr.appendChild(input);
        input.addEventListener("change", () => {
            node.updateLabel(input.value);
        });

        await showModal("分岐条件", pr);
    });

});
document.getElementById("add_loop_start")
.addEventListener("click", () => {
    const node = addNode('loop_start');
    node.el.addEventListener("dblclick",async  () => {
        const pr = document.createElement("div");
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = 100;
        input.value = node.getData("loop_count");
        pr.appendChild(input);
        input.addEventListener("change", () => {
            node.setData("loop_count", Number(input.value));
            node.updateLabel(input.value + '回ループ');
        });

        await showModal("ループ回数", pr);
    });
});
document.getElementById("add_loop_end")
.addEventListener("click", () => addNode('loop_end'));

document.getElementById("compile")
.addEventListener("click", () => {
    compile();
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
const startNode = addNode('start', 100, 30);
addNode('end', 100, 300);

startNode.el.addEventListener("dblclick",async  () => {
    const pr = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text";
    input.value = startNode.label;
    pr.appendChild(input);
    input.addEventListener("change", () => {
        startNode.updateLabel(input.value);
    });

    await showModal("開始ノードの編集", pr);
});


// てすとこーど
// addNode("process");
// addNode("io");
// addNode("decision");