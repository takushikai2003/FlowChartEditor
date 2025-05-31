import { state, offset } from "./var.js";
import { renderLines } from "./renderLines.js";

const canvas = document.getElementById('canvas');
const lines = document.getElementById('lines');

let dragging = null;
let connectFrom = null;
let connectTo = null;

export function addNode(type) {
  const id = 'node-' + Date.now();
  const labels = {
    start: '開始',
    end: '終了',
    io: '入出力',
    process: '雨が降ったら傘をさす',
    decision: '分岐あああああああああ',
    loop_start: 'ループ始端',
    loop_end: 'ループ終端'
  };

  const node = document.createElement('div');
  node.className = 'node';
  node.dataset.id = id;
  node.dataset.type = type;

  const shape = document.createElement('div');
  shape.className = "shape " + type;
  node.appendChild(shape);

  if (type === 'decision') {
    
        const span = document.createElement('span');
        span.textContent = labels[type];
        shape.appendChild(span);
        
        const pointWrapper = document.createElement('div');
        pointWrapper.className = 'point-wrapper';
        node.appendChild(pointWrapper);
        // Noの点
        const fromPointNo = document.createElement('div');
        fromPointNo.className = 'from-point-no';
        pointWrapper.appendChild(fromPointNo);
        // Yesの点
        const fromPointYes = document.createElement('div');
        fromPointYes.className = 'from-point-yes';
        pointWrapper.appendChild(fromPointYes);
        // 入口
        const toPoint = document.createElement('div');
        toPoint.className = 'to-point-decision';
        pointWrapper.appendChild(toPoint);
        toPoint.addEventListener("mousedown",()=>{
            connectTo = toPoint;
            if (connectFrom) {
                const from = connectFrom.dataset.id;
                const to = toPoint.parentNode.parentNode.dataset.id;
                if (!state.edges.find(e => e.from === from && e.to === to)) {
                    state.edges.push({ from, to });
                }
                connectFrom = null;
                renderLines();
            }
        });


        // YesとNoの文字
        const yesLabel = document.createElement('span');
        yesLabel.className = 'yes-label';
        yesLabel.textContent = 'Yes';
        node.appendChild(yesLabel);
        const noLabel = document.createElement('span');
        noLabel.className = 'no-label';
        noLabel.textContent = 'No';
        node.appendChild(noLabel);
    
  }
  else {
        shape.textContent = labels[type];

        const pointWrapper = document.createElement('div');
        pointWrapper.className = 'point-wrapper';
        shape.appendChild(pointWrapper);

        if(type == "start"){
            const fromPoint = document.createElement('div');
            fromPoint.className = 'from-point';
            shape.appendChild(fromPoint);
            fromPoint.addEventListener("mousedown",()=> {
                connectFrom = fromPoint;
                console.log("connectFrom", connectFrom);
            });
        }
        else if(type == "end"){
            const toPoint = document.createElement('div');
            toPoint.className = 'to-point';
            shape.appendChild(toPoint);
            toPoint.addEventListener("mousedown",()=>{
                connectTo = toPoint;
                if (connectFrom) {
                    console.log("connectTo", connectTo);
                    const from = connectFrom.dataset.id;
                    const to = toPoint.parentNode.parentNode.dataset.id;
                    renderLines();
                    connectFrom = null;
                    connectTo = null;
                }
            });
        }
        else{
            const fromPoint = document.createElement('div');
            fromPoint.className = 'from-point';
            shape.appendChild(fromPoint);
            const toPoint = document.createElement('div');
            toPoint.className = 'to-point';
            shape.appendChild(toPoint);
        }
    
  }

  node.style.left = '100px';
  node.style.top = '100px';

  canvas.appendChild(node);
  state.nodes.push({ id, x: 100, y: 100, label: labels[type], type });

  bindNodeEvents(node);
  renderLines();
}



function bindNodeEvents(node) {
    node.onmousedown = e => {
        dragging = node;
        offset.x = e.offsetX;
        offset.y = e.offsetY;
    };

    console.log(state);

    // if(node.)

    // div.onmouseup = e => {
    //     if (connectFrom && connectFrom !== div) {
    //         const from = connectFrom.dataset.id;
    //         const to = div.dataset.id;
    //         if (!state.edges.find(e => e.from === from && e.to === to)) {
    //             state.edges.push({ from, to });
    //         }
    //         connectFrom = null;
    //         renderLines();
    //     }
    //     else {
    //         connectFrom = div;
    //     }
    // };

    node.oncontextmenu = e => {
        e.preventDefault();
        const id = node.dataset.id;
        state.nodes = state.nodes.filter(n => n.id !== id);
        state.edges = state.edges.filter(e => e.from !== id && e.to !== id);
        node.remove();
        renderLines();
    };
}



canvas.onmousemove = e => {
    if (dragging) {
        const id = dragging.dataset.id;
        const node = state.nodes.find(n => n.id === id);
        const x = e.clientX - canvas.offsetLeft - offset.x;
        const y = e.clientY - canvas.offsetTop - offset.y;
        dragging.style.left = x + 'px';
        dragging.style.top = y + 'px';
        node.x = x;
        node.y = y;
        // renderLines();
    }
};
canvas.onmouseup = () => dragging = null;