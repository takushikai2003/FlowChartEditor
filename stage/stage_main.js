import { walls as walls1, start as start1, goal as goal1, isMaze as isMaze1, mazes as mazes1 } from '../data/question_1.js';
import { walls as walls2, start as start2, goal as goal2, isMaze as isMaze2, mazes as mazes2 } from '../data/question_2.js';
import { walls as walls3, start as start3, goal as goal3, isMaze as isMaze3, mazes as mazes3 } from '../data/question_3.js';

import { drawGrid, fillCell, drawImageInCell, drawCircle, drawCross } from './common.js';
import { runtime } from '../runtime/runtime.js';
import { random } from '../random.js';

// URLパラメータから問題を指定
const params = new URLSearchParams(document.location.search);
const q_num = Number(params.get("q"));
console.log("q_num:", q_num);
let walls, start, goal, isMaze, mazes;
if (q_num === 1) {
    walls = walls1;
    start = start1;
    goal = goal1;
    isMaze = isMaze1;
    mazes = mazes1;
} else if (q_num === 2) {
    walls = walls2;
    start = start2;
    goal = goal2;
    isMaze = isMaze2;
    mazes = mazes2;
} else if (q_num === 3) {
    walls = walls3;
    start = start3;
    goal = goal3;
    isMaze = isMaze3;
    mazes = mazes3;
}
else{
    console.error("q_numが不正です。1, 2, 3のいずれかを指定してください。");
}




const chara_now = { x: start.x, y: start.y }; // 現在のキャラクター位置

function imageLoad(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

const charaImage = await imageLoad('./images/chara.png');
const goalImage = await imageLoad('./images/goal.png');
const wallImage = await imageLoad('./images/wall.png');
const questionImage = await imageLoad('./images/question.png');

let selectedMaze;

export function stageInit() {
    // キャラクターの初期位置を設定
    chara_now.x = start.x;
    chara_now.y = start.y;

    if(isMaze){
        // mazesからランダムに壁を選択
        const mazeIndex = random(0, mazes.length - 1);
        selectedMaze = mazes[mazeIndex];
    }
    // ステージを初期化
    drawStage();
}


function drawStage(hide=true) {
    // グリッドを描画
    drawGrid();

    if(isMaze){
        if(hide){
            // 内部を隠して壁を描画
            for (let y = 0; y < selectedMaze.length; y++) {
                for (let x = 0; x < selectedMaze[y].length; x++) {
                    // 外周の壁を描画
                    if(selectedMaze[y][x] &&
                        (x == 0 || y == 0 || x == selectedMaze[y].length - 1 || y == selectedMaze.length - 1)
                    ){
                        drawImageInCell(x, y, wallImage); 
                    }
                    // キャラとゴールの位置は壁を描画しない
                    else if (x === chara_now.x && y === chara_now.y) {
                        drawImageInCell(x, y, charaImage); // スタート位置にキャラを描画
                    }
                    else if (x === goal.x && y === goal.y) {
                        drawImageInCell(x, y, goalImage); // ゴール位置にゴールを描画
                    }
                    else {
                        drawImageInCell(x, y, questionImage); // ?を描画
                    }
                }
            }
        }

        else{
            // 内部を隠さずに壁を描画
            for (let y = 0; y < selectedMaze.length; y++) {
                for (let x = 0; x < selectedMaze[y].length; x++) {
                    if (selectedMaze[y][x]) {
                        drawImageInCell(x, y, wallImage); 
                    }
                }
            }
        }
        
        
    }
    else{
        // 壁を描画
        for (let y = 0; y < walls.length; y++) {
            for (let x = 0; x < walls[y].length; x++) {
                if (walls[y][x]) {
                    drawImageInCell(x, y, wallImage); 
                }
            }
        }
    }

    // ゴール位置を描画
    drawImageInCell(goal.x, goal.y, goalImage);
    
    // キャラ位置を描画
    drawImageInCell(chara_now.x, chara_now.y, charaImage);
}

stageInit(); // ステージを初期化


// 失敗したときに呼ばれる関数
function onFailure() {
    console.error("失敗しました。");
    if(isMaze){
        drawStage(false); // 壁を隠さずに描画
    }
    
    drawCross(); // 失敗時に青のバツを描画
    runtime.stop(); // ランタイムを停止
}

// 成功したときに呼ばれる関数
function onSuccess() {
    console.log("成功しました！");
    if(isMaze){
        drawStage(false); // 壁を隠さずに描画
    }

    drawCircle(); // 成功時に赤い丸を描画
    runtime.stop(); // ランタイムを停止
}

// 座標に壁があるかどうかをチェックする関数
function isWall(x, y) {
    if (x < 0 || x >= walls[0].length || y < 0 || y >= walls.length) {
        return true; // 範囲外は壁とみなす
    }
    return walls[y][x];
}

// キャラクターがゴールに到達したかどうかをチェックする関数
function isGoal() {
    return chara_now.x === goal.x && chara_now.y === goal.y;
}


// 上に移動する関数
// ゴールについたらtrueを返す
export function moveUp() {
    const newY = chara_now.y + 1;
    if (!isWall(chara_now.x, newY)) {
        chara_now.y = newY;
        drawStage();
        if (isGoal()) {
            console.log("ゴールに到達しました！");
            onSuccess(); // 成功時の処理を呼び出す
            return true; // ゴールに到達
        }
    }
    else {
        fillCell(chara_now.x, newY, 'red'); // 壁にぶつかったら赤く塗る
        onFailure();
        return false; // ゴールに到達していない
    }
    return false; // ゴールに到達していない
}
// 下に移動する関数
// ゴールについたらtrueを返す
export function moveDown() {
    const newY = chara_now.y - 1;
    if (!isWall(chara_now.x, newY)) {
        chara_now.y = newY;
        drawStage();
        if (isGoal()) {
            console.log("ゴールに到達しました！");
            onSuccess(); // 成功時の処理を呼び出す
            return true; // ゴールに到達
        }
    }
    else {
        fillCell(chara_now.x, newY, 'red'); // 壁にぶつかったら赤く塗る
        onFailure();
        return false; // ゴールに到達していない
    }
    return false; // ゴールに到達していない
}
// 右に移動する関数
// ゴールについたらtrueを返す
export function moveRight() {
    const newX = chara_now.x + 1;
    if (!isWall(newX, chara_now.y)) {
        chara_now.x = newX;
        drawStage();
        if (isGoal()) {
            // fillCell(newX, chara_now.y, 'green'); // ゴールに到達したら緑に塗る
            console.log("ゴールに到達しました！");
            onSuccess(); // 成功時の処理を呼び出す
            return true; // ゴールに到達
        }
    }
    else {
        fillCell(newX, chara_now.y, 'red'); // 壁にぶつかったら赤く塗る
        onFailure();
        return false; // ゴールに到達していない
    }
    return false; // ゴールに到達していない
}
// 左に移動する関数
// ゴールについたらtrueを返す
export function moveLeft() {
    const newX = chara_now.x - 1;
    if (!isWall(newX, chara_now.y)) {
        chara_now.x = newX;
        drawStage();
        if (isGoal()) {
            fillCell(newX, chara_now.y, 'green'); // ゴールに到達したら緑に塗る
            console.log("ゴールに到達しました！");
            onSuccess(); // 成功時の処理を呼び出す
            return true; // ゴールに到達
        }
    }
    else {
        fillCell(newX, chara_now.y, 'red'); // 壁にぶつかったら赤く塗る
        onFailure();
        return false; // ゴールに到達していない
    }
    return false; // ゴールに到達していない
}



// ----条件分岐
// 上に壁があるかどうかをチェックする関数
export function isWallUp() {
    const newY = chara_now.y + 1;
    return isWall(chara_now.x, newY);
}
// 下に壁があるかどうかをチェックする関数
export function isWallDown() {
    const newY = chara_now.y - 1;
    return isWall(chara_now.x, newY);
}
// 右に壁があるかどうかをチェックする関数
export function isWallRight() {
    const newX = chara_now.x + 1;
    return isWall(newX, chara_now.y);
}
// 左に壁があるかどうかをチェックする関数
export function isWallLeft() {
    const newX = chara_now.x - 1;
    return isWall(newX, chara_now.y);
}