// 1,1から4,4までの階段
const walls = [
    [true, true, true, true, true, true, true],
    [true, false, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, true, false, false, true, true, true],
    [true, true, true, false, false, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true]
];//7*7

const start = { x: 1, y: 1 }; // スタート位置
const goal = { x: 4, y: 4 }; // ゴール位置

const isMaze = false; // 迷路かどうか
const mazes = []; // 迷路データは空（迷路ではないため）

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
