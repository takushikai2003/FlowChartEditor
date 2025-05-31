import { state } from "./var.js";

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
    const fromEl = canvas.querySelector(`.node[data-id='${edge.from}']`);
    const toEl = canvas.querySelector(`.node[data-id='${edge.to}']`);
    if (!fromEl || !toEl) continue;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - canvasRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
    const x2 = toRect.left + toRect.width / 2 - canvasRect.left;
    const y2 = toRect.top + toRect.height / 2 - canvasRect.top;

    // 階段状になるよう線を引く
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // 垂直線
    renderLine(x1, y1, x1, midY);
    // 水平線
    renderLine(x1, midY, x2, midY);
    // 矢印付きの垂直線
    renderArrow(x2, midY, x2, y2);
  }
}

// 単純な直線を引く
function renderLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#000");
  line.setAttribute("stroke-width", "2");
  lines.appendChild(line);
}


// 矢印付きの直線を引く
function renderArrow(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#000");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("marker-end", "url(#arrow)");
  lines.appendChild(line);
}