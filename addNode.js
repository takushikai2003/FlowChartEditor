import { state } from "./var.js";
import { renderLines } from "./renderLines.js";
import { Node } from "./class.js";

const FROM_LINE_COLOR = 'red';
const TO_LINE_COLOR = 'blue';


const canvas = document.getElementById('canvas');
const offset = { x: 0, y: 0 };

let dragging = null;
// let connectTo = null;

export function addNode(type, x=50, y=50) {
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
        fromPointNo.dataset.id = 'from-point-no-' + Date.now();
        pointWrapper.appendChild(fromPointNo);
        // Yesの点
        const fromPointYes = document.createElement('div');
        fromPointYes.className = 'from-point-yes';
        fromPointYes.dataset.id = 'from-point-yes-' + Date.now();
        pointWrapper.appendChild(fromPointYes);
        // 入口
        const toPoint = document.createElement('div');
        toPoint.className = 'to-point-decision';
        toPoint.dataset.id = 'to-point-decision-' + Date.now();
        pointWrapper.appendChild(toPoint);


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

        // const pointWrapper = document.createElement('div');
        // pointWrapper.className = 'point-wrapper';
        // shape.appendChild(pointWrapper);

        if(type == "start"){
            const fromPoint = document.createElement('div');
            fromPoint.className = 'from-point';
            fromPoint.dataset.id = 'from-point-' + Date.now();
            shape.appendChild(fromPoint);
        }
        else if(type == "end"){
            const toPoint = document.createElement('div');
            toPoint.className = 'to-point';
            toPoint.dataset.id = 'to-point-' + Date.now();
            shape.appendChild(toPoint);
        }
        else{
            const fromPoint = document.createElement('div');
            fromPoint.className = 'from-point';
            fromPoint.dataset.id = 'from-point-' + Date.now();
            shape.appendChild(fromPoint);
            const toPoint = document.createElement('div');
            toPoint.className = 'to-point';
            toPoint.dataset.id = 'to-point-' + Date.now();
            shape.appendChild(toPoint);
        }
    
    }

    node.style.left = x + 'px';
    node.style.top = y + 'px';

    canvas.appendChild(node);
    state.nodes.push(new Node( id, type, labels[type], x, y));

    bindNodeEvents(node);
    renderLines();
}



function bindNodeEvents(node) {
    node.onmousedown = e => {
        const target_rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - target_rect.left;
        const y = e.clientY - target_rect.top;
        dragging = node;
        offset.x = x//e.offsetX;
        offset.y = y//e.offsetY;
    };

    const fromPoint = node.querySelector('.from-point');
    const toPoint = node.querySelector('.to-point');
    const fromPointNo = node.querySelector('.from-point-no');
    const fromPointYes = node.querySelector('.from-point-yes');
    const toPointDecision = node.querySelector('.to-point-decision');

    if (fromPoint) {
        fromPoint.onmousedown = () => {
            connectFrom = fromPoint;
        };
        fromPoint.onmouseover = () => {
            fromPoint.style.backgroundColor = FROM_LINE_COLOR;
        }
        fromPoint.onmouseleave = () => {
            fromPoint.style.backgroundColor = '';
        }
    }
    if (toPoint) {
        toPoint.onmousedown = () => {
            // connectTo = toPoint;
            if (connectFrom) {
                const from = connectFrom.dataset.id;
                const to = toPoint.dataset.id;
                if(connectFrom.parentNode.parentNode === toPoint.parentNode.parentNode) return; // 同じノードへの接続は無視

                if (!state.edges.find(e => e.from === from && e.to === to)) {
                    state.edges.push({ from, to });
                }
                connectFrom = null;
                // connectTo = null;
                renderLines();
            }
        };

        toPoint.onmouseover = () => {
            if(!connectFrom) return;
            toPoint.style.backgroundColor = TO_LINE_COLOR;
        }
        toPoint.onmouseleave = () => {
            toPoint.style.backgroundColor = '';
        }
    }

    // 分岐の点
    if (fromPointNo) {
        fromPointNo.onmousedown = () => {
            connectFrom = fromPointNo;
        };
        fromPointNo.onmouseover = () => {
            fromPointNo.style.backgroundColor = FROM_LINE_COLOR;
        }
        fromPointNo.onmouseleave = () => {
            fromPointNo.style.backgroundColor = '';
        }
    }
    if (fromPointYes) {
        fromPointYes.onmousedown = () => {
            connectFrom = fromPointYes;
        };
        fromPointYes.onmouseover = () => {
            fromPointYes.style.backgroundColor = FROM_LINE_COLOR;
        }
        fromPointYes.onmouseleave = () => {
            fromPointYes.style.backgroundColor = '';
        }
    }
    if (toPointDecision) {
        toPointDecision.onmousedown = () => {
            // connectTo = toPoint;
            if (connectFrom) {
                const from = connectFrom.dataset.id;
                const to = toPointDecision.dataset.id;
                if(connectFrom.parentNode.parentNode === toPointDecision.parentNode.parentNode) return; // 同じノードへの接続は無視

                if (!state.edges.find(e => e.from === from && e.to === to)) {
                    state.edges.push({ from, to });
                }
                connectFrom = null;
                // connectTo = null;
                renderLines();
            }
        };

        toPointDecision.onmouseover = () => {
            if(!connectFrom) return;
            toPointDecision.style.backgroundColor = TO_LINE_COLOR;
        }
        toPointDecision.onmouseleave = () => {
            toPointDecision.style.backgroundColor = '';
        }
    }


    // 右クリックでノードを削除
    node.oncontextmenu = e => {
        e.preventDefault();
    
        // start,endノードは削除できない
        if (node.dataset.type === 'start' || node.dataset.type === 'end'){
            alert('開始ノードと終了ノードは削除できません。');
            return;
        }
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
        // const x = e.clientX - canvas.offsetLeft - offset.x;
        // const y = e.clientY - canvas.offsetTop - offset.y;

        const target_rect = e.currentTarget.getBoundingClientRect();
        const _x = e.clientX - target_rect.left;
        const _y = e.clientY - target_rect.top;

        const x = _x - offset.x;
        const y = _y - offset.y;
        dragging.style.left = x + 'px';
        dragging.style.top = y + 'px';
        node.x = x;
        node.y = y;
        renderLines();
    }
};
canvas.onmouseup = () => dragging = null;