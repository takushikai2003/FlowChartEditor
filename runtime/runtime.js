'use strict';
import { state as _state } from '../var.js';

export function run() {
    // まずはstateをコピーしておく
    const state = JSON.parse(JSON.stringify(_state));

    const startNode = state.nodes.find(node => node.type === 'start');
    const startNodeEl = document.querySelector(`.node[data-id="${startNode.id}"]`);
    const startNodefromId = startNodeEl.querySelector('.from-point').dataset.id;


    let code = '';
    code += "start\n";


    function eatToken(fromId){
        const edge = state.edges.find(edge => edge.from === fromId);
        if(!edge) return null;
        const edgeIndex = state.edges.indexOf(edge);
        // そのエッジを消す
        if(edgeIndex !== -1) {
            state.edges.splice(edgeIndex, 1);
        }

        console.log(edge.to);
        const nextNodeDom = getNodeDomBytoId(edge.to); // そのエッジのtoポイントを探す

        code += `${nextNodeDom.dataset.type}\n`;
        console.log(nextNodeDom.dataset.type);
        
        switch(nextNodeDom.dataset.type) {
            case 'start':
                console.error("Start node reached, this should not happen.");
                return null;
            case 'end':
                console.log("End node reached.");
                return null;
            case 'io':
            case 'process':
            case 'loop_start':
            case 'loop_end':
                const fromId = nextNodeDom.querySelector('.from-point').dataset.id;
                eatToken(fromId);
                break;
            
            case 'decision':
                const fromIdNo = nextNodeDom.querySelector('.from-point-no').dataset.id;
                const fromIdYes = nextNodeDom.querySelector('.from-point-yes').dataset.id;
                eatToken(fromIdNo);
                eatToken(fromIdYes);
                break;
            
            default:
                console.error("Unknown node type:", nextNodeDom.dataset.type);
                break;
        }
    }


    eatToken(startNodefromId);
    console.log(code);
}


function getNodeDomBytoId(toId){
    // toがedgeなら、その先のNodeを探す
    if(toId.includes("line-group")){
        toId = toId.slice(-22);
    }

    // そのエッジのtoポイントを探す
    const toPoint = document.querySelector(`[data-id="${toId}"]`);

    
    return toPoint.closest('.node');
}