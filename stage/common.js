const stage_canvas = document.getElementById('stage_canvas');

const ctx = stage_canvas.getContext('2d');
const gridSize = 100;

export function drawGrid() {
    // まずはキャンバスをクリア
    ctx.clearRect(0, 0, stage_canvas.width, stage_canvas.height);
    // 7×7のグリッドを描画
    for (let x = 0; x <= stage_canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, stage_canvas.height);
    }
    for (let y = 0; y <= stage_canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(stage_canvas.width, y);
    }
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
}


// 左下を0,0として、右上を6,6とする座標系で色を塗りつぶす関数
export function fillCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, (6 - y) * gridSize, gridSize, gridSize);
}
// // 例: (3, 2)のセルを塗りつぶす
// fillCell(3, 2, '#777777');

// 同様に、指定の画像をセルに描画する関数
export function drawImageInCell(x, y, img) {
    ctx.drawImage(img, x * gridSize, (6 - y) * gridSize, gridSize, gridSize);
}

// canvas全体に大きく太さ10での赤丸を描く関数（canvasの70%の大きさ）
export function drawCircle() {
    const centerX = stage_canvas.width / 2;
    const centerY = stage_canvas.height / 2;
    const radius = Math.min(stage_canvas.width, stage_canvas.height) * 0.35; // 70%の大きさ

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();
}

// canvas全体に大きく太さ10での青のバツを描く関数（canvasの70%の大きさ）
export function drawCross() {
    const centerX = stage_canvas.width / 2;
    const centerY = stage_canvas.height / 2;
    const size = Math.min(stage_canvas.width, stage_canvas.height) * 0.35; // 70%の大きさ

    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY - size);
    ctx.lineTo(centerX + size, centerY + size);
    ctx.moveTo(centerX + size, centerY - size);
    ctx.lineTo(centerX - size, centerY + size);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
}


// 例: (4, 5)のセルに画像を描画する
// drawImageInCell(4, 5, './images/goal.png');
// drawImageInCell(6, 6, './images/chara.png');
// drawImageInCell(1, 1, './images/wall.png');