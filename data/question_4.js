// 1,1から4,4までの階段
const walls = [
    // [true, true, true, true, true, true, true],
    // [true, false, false, true, true, true, true],
    // [true, true, true, true, true, true, true],
    // [true, true, true, true, true, true, true],
    // [true, true, true, true, true, true, true],
    // [true, true, true, true, true, true, true],
    // [true, true, true, true, true, true, true]
];//7*7

const walls1 =[
    [true, true, true, true, true, true, true],
    [true, false, true, true, true, true, true],
    [true, false, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true]
];

const walls2 = [
    [true, true, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true]
];

const isMaze = false; // 迷路かどうか
const mazes = []; // 迷路の配列
const start = {x:1, y:1}; // スタート位置
const goal = {}; // ゴール位置

const isRandom = true; // ランダムな壁にするどうか
const wallsList = [walls1, walls2]; // ランダムにする場合の壁の配列
const goals = [{x:1,y:2},{x:2,y:1}]; // ランダムにする場合のゴールの配列

const instruction = "ゴールが、上か右かランダムに決まります。";


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
