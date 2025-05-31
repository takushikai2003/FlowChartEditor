import { addNode } from "./addNode.js";
import { saveFile, loadFile } from "./fileMagager.js";


document.getElementById("add_start")
.addEventListener("click", () => addNode('start'));
document.getElementById("add_end")
.addEventListener("click", () => addNode('end'));
document.getElementById("add_io")
.addEventListener("click", () => addNode('io'));
document.getElementById("add_process")
.addEventListener("click", () => addNode('process'));
document.getElementById("add_decision")
.addEventListener("click", () => addNode('decision'));
document.getElementById("add_loop")
.addEventListener("click", () => addNode('loop'));

document.getElementById("save_file")
.addEventListener("click", () => {
    saveFile();
});
document.getElementById("load_file")
.addEventListener("change", (event) => {
    loadFile(event);
});


// てすとこーど
addNode("process");
addNode("io");
addNode("decision");