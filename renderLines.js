import { state } from "./var.js";
import { saveHistory } from "./history.js";

const LINE_SELECTED_COLOR = "#FF11FF"; // 選択時の線の色

const canvas = document.getElementById('canvas');
const lines = document.getElementById('lines');

export function renderLines() {
	saveHistory("state", state); // 状態を保存

	// linesより後ろのDOM状態を保存
	const svg = document.getElementById("lines");
	let htmlString = "";

	let next = svg.nextElementSibling;
	while (next) {
		htmlString += next.outerHTML;
		next = next.nextElementSibling;
	}

	saveHistory("dom", htmlString); // linesより後ろのDOM状態を保存

	
	const _lines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	_lines.innerHTML = `
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#000"/>
        </marker>
      </defs>`;
	
    // lines.innerHTML = `
    //   <defs>
    //     <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
    //       <path d="M0,0 L10,5 L0,10 Z" fill="#000"/>
    //     </marker>
    //   </defs>`;


	function renderEdge(edge) {
		// console.log(edge.from, edge.to);
        const fromEl = canvas.querySelector(`[data-id="${edge.from}"]`);
        const toEl = canvas.querySelector(`[data-id="${edge.to}"]`);

        if (!fromEl || !toEl) {
			// console.warn(`要素が見つからない: fromEl=${fromEl}, toEl=${toEl}`);
			return false; // 要素が見つからない場合はfalseを返す
		}
		const fromRect = fromEl.parentNode.parentNode.querySelector(".shape").getBoundingClientRect();
		// 接続先は、それが線であるかノードであるかで取る要素が違う
        const toRect = edge.to.includes("line-group") ? 
			toEl.getBoundingClientRect() :
			toEl.parentNode.parentNode.querySelector(".shape").getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

		const line_group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		line_group.setAttribute("class", "line-group");
		line_group.setAttribute("style", "pointer-events: bounding-box;");
		// lineのidは始点と終点のidを連結したものにする
		line_group.dataset.id = 'line-group-' + edge.from + '-' + edge.to;

		// ノードの種類によって線の引き方を変える
		// Noから出る線は、まず横向きになるように引き、次に縦方向に矢印を引く
		if(fromEl.classList.contains("from-point-no")){
			// node-lineの場合は右に回る
			if(toEl.classList.contains("line-group")){

				const x1 = fromRect.left + fromRect.width/2 - canvasRect.left;
				const y1 = fromRect.top + fromRect.height - canvasRect.top;
				const x2 = toRect.left - canvasRect.left;
				const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
				const midX = (x1 + x2) / 2;
				const midY = (y1 + y2) / 2;
				// const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
				// const y1 = fromRect.top + fromRect.height - canvasRect.top;
				// const x2 = toRect.left + toRect.width - canvasRect.left;
				// const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
				// const midX = (x1 + x2) / 2;
				// const midY = (y1 + y2) / 2;

				// 右に線をずらす幅
				const right_shift = 130;


				if(y1 < y2) {
					// 垂直線
					renderLine(line_group, x1, y1, x1, y2);
					// 水平線
					renderArrow(line_group, x1, y2, x2, y2);
				}
				else{
					// 下に少し降りる
					renderLine(line_group, x1, y1, x1, y1+30);
					// 水平線
					renderLine(line_group, x1, y1+30, x1+right_shift, y1+30);
					// 垂直線
					renderLine(line_group, x1+right_shift, y1+30, x1+right_shift, y2);
					// 水平線
					renderArrow(line_group, x1+right_shift, y2, x2, y2);
				}
			}
			else{
				const x1 = fromRect.left + fromRect.width - canvasRect.left;
				const y1 = fromRect.top + fromRect.height/2 - canvasRect.top;
				const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
				const y2 = toRect.top - canvasRect.top;
				const midX = (x1 + x2) / 2;
				const midY = (y1 + y2) / 2;
				
				if(y1 < y2) {
					if(x1 < x2){
						// 水平線
						renderLine(line_group, x1, y1, x2, y1);
						// 垂直線
						renderArrow(line_group, x2, y1, x2, y2);
					}
					else{
						// すこし右
						renderLine(line_group, x1, y1, x1+30, y1);
						// 垂直線
						renderLine(line_group, x1+30, y1, x1+30, midY);
						// 水平線
						renderLine(line_group, x1+30, midY, x2, midY);
						// 矢印付きの垂直線
						renderArrow(line_group, x2, midY, x2, y2);
					}
				}
				else{
					// すこし右
					renderLine(line_group, x1, y1, x1+30, y1);
					// 垂直線 少し上まで
					renderLine(line_group, x1+30, y1, x1+30, y2-30);
					// 水平線
					renderLine(line_group, x1+30, y2-30, x2, y2-30);
					// 矢印付きの垂直線
					renderArrow(line_group, x2, y2-30, x2, y2);
				}
				
			}
			
		}
		// No以外のノードから他の線に線を引くときは、迂回して書く
		else if(toEl.classList.contains("line-group")){
			// console.log("node to line-group");

			const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
			const y1 = fromRect.top + fromRect.height - canvasRect.top;
			const x2 = toRect.left + toRect.width - canvasRect.left;
			const y2 = toRect.top + toRect.height / 2 - canvasRect.top;
			const midX = (x1 + x2) / 2;
			const midY = (y1 + y2) / 2;

			// 線をずらす幅
			const right_shift = 100;

			if(y1 < y2) {
				if(x1 < x2){
					// 下に降りる
					renderLine(line_group, x1, y1, x1, y2);
					// 水平線
					renderArrow(line_group, x1, y2, x2, y2);
				}
				else{
					// 垂直線
					renderLine(line_group, x1, y1, x1, y2);
					// 水平線
					renderArrow(line_group, x1, y2, x2, y2);
				}
			}
			else{
				if(x1 < x2){
					// 下に少し降りる
					renderLine(line_group, x1, y1, x1, y1+30);
					// 水平線
					renderLine(line_group, x1, y1+30, x1+right_shift, y1+30);
					// 垂直線
					renderLine(line_group, x1+right_shift, y1+30, x1+right_shift, y2);
					// 水平線
					renderArrow(line_group, x1+right_shift, y2, x2, y2);
				}
				else{
					// 下に少し降りる
					renderLine(line_group, x1, y1, x1, y1+30);
					// 水平線
					renderLine(line_group, x1, y1+30, x1+right_shift, y1+30);
					// 垂直線
					renderLine(line_group, x1+right_shift, y1+30, x1+right_shift, y2);
					// 水平線
					renderArrow(line_group, x1+right_shift, y2, x2, y2);
				}
			}
		}
		// その他のノード（下to上）は縦方向の階段状になるよう線を引く
		else{
			const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
			const y1 = fromRect.top + fromRect.height - canvasRect.top;
			const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
			const y2 = toRect.top - canvasRect.top;
			const midX = (x1 + x2) / 2;
			const midY = (y1 + y2) / 2;

			if(y1 < y2) {
				// 垂直線
				renderLine(line_group, x1, y1, x1, midY);
				// 水平線
				renderLine(line_group, x1, midY, x2, midY);
				// 矢印付きの垂直線
				renderArrow(line_group, x2, midY, x2, y2);
			}
			if(y1 > y2) {
				// 下に少し降りる
				renderLine(line_group, x1, y1, x1, y1+30);
				// 水平線
				renderLine(line_group, x1, y1+30, midX, y1+30);
				// 垂直線 少し上まで
				renderLine(line_group, midX, y1+30, midX, y2-30);
				// 水平線
				renderLine(line_group, midX, y2-30, x2, y2-30);
				
				// 矢印付きの垂直線
				renderArrow(line_group, x2, y2-30, x2, y2);
			}
			
		}
        

		line_group.addEventListener("mousedown", (event) => {
			event.stopPropagation();
            // connectTo = line_group;
            if (connectFrom) {
                const from = connectFrom.dataset.id;
                const to = line_group.dataset.id;
                // if(connectFrom.parentNode.parentNode === toPoint.parentNode.parentNode) return; // 同じノードへの接続は無視

                if (!state.edges.find(e => e.from === from && e.to === to)) {
                    state.edges.push({ from, to });
                }
                connectFrom = null;
                // connectTo = null;
                renderLines();
            }
		});
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
		_lines.appendChild(line_group);

	}


	lines.innerHTML = ''; // 既存の線をクリア
	lines.appendChild(_lines);

	// まず、node-nodeの線を引く
    for (const edge of state.edges) {
		if(edge.from.includes("line-group") || edge.to.includes("line-group")) {
			// ノードから線への接続は無視
			continue;
		}
		// console.log("node to node");
		renderEdge(edge);
    }

	// 次に、node-edgeの線を引く
	for (const edge of state.edges) {
		if(edge.from.includes("line-group") || edge.to.includes("line-group")) {
			// console.log("node to edge");
			renderEdge(edge);
			continue;
		}
	}

	// 最後に、参照先が無いedgeを削除する
	state.edges = state.edges.filter(edge => {
		const fromEl = canvas.querySelector(`[data-id="${edge.from}"]`);
		const toEl = canvas.querySelector(`[data-id="${edge.to}"]`);
		if (!fromEl || !toEl) {
			// console.warn(`要素が見つからない: fromEl=${fromEl}, toEl=${toEl}`);
			return false; // 要素が見つからない場合は削除
		}
		return true; // 要素が存在する場合は残す
	});
	
	return true;
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

window.renderLines = renderLines; // グローバルに公開しておく