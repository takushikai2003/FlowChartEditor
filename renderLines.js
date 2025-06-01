import { state } from "./var.js";

const LINE_SELECTED_COLOR = "#FF11FF"; // 選択時の線の色

const canvas = document.getElementById('canvas');
const lines = document.getElementById('lines');

export function renderLines() {
    lines.innerHTML = `
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#000"/>
        </marker>
      </defs>`;

    for (const edge of state.edges) {
        // console.log(edge.from, edge.to);
        const fromEl = canvas.querySelector(`[data-id="${edge.from}"]`);
        const toEl = canvas.querySelector(`[data-id="${edge.to}"]`);
        // console.log(fromEl, toEl);
        if (!fromEl || !toEl) continue;

		const fromRect = fromEl.parentNode.parentNode.querySelector(".shape").getBoundingClientRect();
        const toRect = toEl.parentNode.parentNode.querySelector(".shape").getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

		const line_group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		line_group.setAttribute("class", "line-group");
		line_group.setAttribute("style", "pointer-events: bounding-box;");

		// ノードの種類によって線の引き方を変える
		// Noから出る線は、まず横向きになるように引き、次に縦方向に矢印を引く
		if(fromEl.classList.contains("from-point-no")){
			const x1 = fromRect.left + fromRect.width - canvasRect.left;
			const y1 = fromRect.top + fromRect.height/2 - canvasRect.top;
			const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
			const y2 = toRect.top - canvasRect.top;
			const midX = (x1 + x2) / 2;
			const midY = (y1 + y2) / 2;
			
			// 水平線
			renderLine(line_group, x1, y1, x2, y1);
			// 垂直線
			renderArrow(line_group, x2, y1, x2, y2);
		}
		// その他のノードは縦方向の階段状になるよう線を引く
		else{
			const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
			const y1 = fromRect.top + fromRect.height - canvasRect.top;
			const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
			const y2 = toRect.top - canvasRect.top;
			const midX = (x1 + x2) / 2;
			const midY = (y1 + y2) / 2;
			// 垂直線
			renderLine(line_group, x1, y1, x1, midY);
			// 水平線
			renderLine(line_group, x1, midY, x2, midY);
			// 矢印付きの垂直線
			renderArrow(line_group, x2, midY, x2, y2);
		}
        

		// line_group.addEventListener("click", (event) => {
		// 	event.stopPropagation();
		// 	console.log("Line clicked:", edge.from, edge.to);
		// });
		// マウスオーバーで色を変える
		line_group.addEventListener("mouseover", (event) => {
			event.stopPropagation();
			line_group.querySelectorAll("line").forEach(line => {
				line.setAttribute("stroke", LINE_SELECTED_COLOR);
			});

		});
		// マウスアウトで元の色に戻す
		line_group.addEventListener("mouseout", (event) => {
			event.stopPropagation();
			line_group.querySelectorAll("line").forEach(line => {
				line.setAttribute("stroke", "#000");
			});
		});
		// 右クリックで消す
		line_group.addEventListener("contextmenu", (event) => {
			event.stopPropagation();
			event.preventDefault();
			const index = state.edges.findIndex(e => e.from === edge.from && e.to === edge.to);
			if (index !== -1) {
				state.edges.splice(index, 1);
				renderLines();
			}
			return false;
		});


		// SVGに追加
		lines.appendChild(line_group);
    }
}

// 単純な直線を引く
function renderLine(group, x1, y1, x2, y2) {
	const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", "#000");
	line.setAttribute("stroke-width", "2");

	group.appendChild(line);
}


// 矢印付きの直線を引く
function renderArrow(group, x1, y1, x2, y2) {
	const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", "#000");
	line.setAttribute("stroke-width", "2");
	line.setAttribute("marker-end", "url(#arrow)");
	
	group.appendChild(line);
}