// 1,1から3,4まで階段状に
export const walls = [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, true, true]
];//7*7

export const start = { x: 1, y: 1 }; // スタート位置
export const goal = { x: 3, y: 4 }; // ゴール位置

export const isMaze = false; // 迷路かどうか
export const mazes = []; // 迷路データは空（迷路ではないため）