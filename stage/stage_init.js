const stage_canvas = document.getElementById('stage_canvas');
stage_canvas.width = 700;
stage_canvas.height = 700;

const ctx = stage_canvas.getContext('2d');
// 7×7のグリッドを描画
const gridSize = 100;
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

// 左下を0,0として、右上を6,6とする座標系で色を塗りつぶす関数
function fillCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, (6 - y) * gridSize, gridSize, gridSize);
}
// 例: (3, 2)のセルを赤色で塗りつぶす
fillCell(3, 2, '#777777');

// 同様に、指定の画像をセルに描画する関数
function drawImageInCell(x, y, imageSrc) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x * gridSize, (6 - y) * gridSize, gridSize, gridSize);
    };
    img.src = imageSrc;
}

// 例: (4, 5)のセルに画像を描画する
drawImageInCell(4, 5, './images/goal.png');
drawImageInCell(6, 6, './images/chara.png');
drawImageInCell(1, 1, './images/wall.png');