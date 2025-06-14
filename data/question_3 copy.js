// 1,1から4,4までの階段
const walls = [
    [true, true, true, true, true, true, true],
    [true, false, true, false, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, true, false, true, false, true],
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
    [true, false, false, false, false, false, true],
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


const isMaze = true; // 迷路かどうか

const mazes = [maze1, maze2, maze3];

const start = { x: 1, y: 1 }; // スタート位置
const goal = { x: 5, y: 5 }; // ゴール位置

const isRandom = false; // ランダムな壁にするどうか
const wallsList = []; // ランダムにする場合の壁の配列
const goals = []; // ランダムにする場合のゴールの配列

const instruction = "";

export const question = {
    walls: walls,
    isMaze: isMaze,
    mazes: mazes,
    start: start,
    goal: goal,
    isRandom: isRandom,
    wallsList: wallsList,
    goals: goals,
    instruction: instruction
}
