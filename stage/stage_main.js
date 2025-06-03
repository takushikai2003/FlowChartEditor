import { walls, start, goal } from '../data/question.js';
import { drawGrid, fillCell, drawImageInCell, drawCircle, drawCross } from './common.js';

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

export function stageInit() {
    // キャラクターの初期位置を設定
    chara_now.x = start.x;
    chara_now.y = start.y;
    // ステージを初期化
    drawStage();
}

function drawStage() {
    // グリッドを描画
    drawGrid();

    // 壁を描画
    for (let y = 0; y < walls.length; y++) {
        for (let x = 0; x < walls[y].length; x++) {
            if (walls[y][x]) {
                drawImageInCell(x, y, wallImage); 
            }
        }
    }

    // キャラ位置を描画
    drawImageInCell(chara_now.x, chara_now.y, charaImage);

    // ゴール位置を描画
    drawImageInCell(goal.x, goal.y, goalImage);
}

drawStage();


// 失敗したときに呼ばれる関数
function onFailure() {
    console.error("失敗しました。");
    drawCross(); // 失敗時に青のバツを描画
}

// 成功したときに呼ばれる関数
function onSuccess() {
    console.log("成功しました！");
    // ここに成功時の処理を追加
    drawCircle(); // 成功時に赤い丸を描画
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
            fillCell(newX, chara_now.y, 'green'); // ゴールに到達したら緑に塗る
            console.log("ゴールに到達しました！");
            onSuccess(); // 成功時の処理を呼び出す
            return true; // ゴールに到達
        }
    }
    else {
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