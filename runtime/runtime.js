'use strict';
import { state } from '../var.js';

export function run() {
    // まずはstateをコピーしておく(state.edgeを削除するため)
    // state.nodesはfnの情報を持っているので、そこから必要な情報を取得する
    const state_copy = JSON.parse(JSON.stringify(state));

    const startNode = state_copy.nodes.find(node => node.type === 'start');
    const startNodeEl = document.querySelector(`.node[data-id="${startNode.id}"]`);
    const startNodefromId = startNodeEl.querySelector('.from-point').dataset.id;

    let code = '';
    code += "start\n";


    function eatToken(fromId){
        const edge = state_copy.edges.find(edge => edge.from === fromId);
        if(!edge) return null;
        const edgeIndex = state_copy.edges.indexOf(edge);
        // そのエッジを消す
        if(edgeIndex !== -1) {
            state_copy.edges.splice(edgeIndex, 1);
        }

        // console.log(edge.to);
        const nextNodeDom = getNodeDomBytoId(edge.to); // そのエッジのtoポイントを探す

        code += `${nextNodeDom.dataset.type}\n`;
        // console.log(nextNodeDom.dataset.type);
        // ノードに紐づけられた内容を表示
        const nextNode = state.nodes.find(node => node.id === nextNodeDom.dataset.id);
        // console.log(nextNode)
        // if(nextNode?.data.fn){
        //     console.log(nextNode.label);
        //     console.log(`Function: ${nextNode.data.fn}`);
        // }
        
        
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