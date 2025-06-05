// 1,1から4,4までの階段
const walls = [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, true, true],
    [true, false, true, true, true, true, true],
    [true, false, false, false, true, false, true],
    [true, true, false, true, true, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, false, true]
];//7*7



const isMaze = false; // 迷路かどうか

const mazes = [];

const start = { x: 1, y: 1 }; // スタート位置
const goal = { x: 5, y: 6 }; // ゴール位置

const isRandom = false; // ランダムな壁にするどうか
const wallsList = []; // ランダムにする場合の壁の配列
const goals = []; // ランダムにする場合のゴールの配列
const instruction = "<h3>課題4</h3>迷路";

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
