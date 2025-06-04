// 1,1から4,4までの階段
export const walls = [
    [true, true, true, true, true, true, true],
    [true, false, true, false, true, false, true],
    [true, false, true, false, false, false, true],
    [true, false, false, false, true, false, true],
    [true, true, true, true, false, false, true],
    [true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true]
];//7*7

const maze1 = [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, true, true, true],
    [true, true, true, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, true, true]
];//7*7

const maze2 = [
    [true, true, true, true, true, true, true],
    [true, false, true, false, true, true, true],
    [true, false, true, false, false, false, true],
    [true, false, true, false, true, false, true],
    [true, true, true, true, false, false, true],
    [true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true]
];
const maze3 = [
    [true, true, true, true, true, true, true],
    [true, false, true, false, true, false, true],
    [true, false, true, false, false, false, true],
    [true, false, false, false, true, false, true],
    [true, true, true, true, true, false, true],
    [true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true]
];


export const isMaze = true; // 迷路かどうか

export const mazes = [maze1, maze2, maze3];

export const start = { x: 1, y: 1 }; // スタート位置
export const goal = { x: 5, y: 5 }; // ゴール位置