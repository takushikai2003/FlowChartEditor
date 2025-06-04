// 1,1から4,4までの階段
export const walls = [
    [true, true, true, true, true, true, true],
    [true, false, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, true, false, false, true, true, true],
    [true, true, true, false, false, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true]
];//7*7

export const start = { x: 1, y: 1 }; // スタート位置
export const goal = { x: 4, y: 4 }; // ゴール位置

export const isMaze = false; // 迷路かどうか
export const maze = []; // 迷路データは空（迷路ではないため）