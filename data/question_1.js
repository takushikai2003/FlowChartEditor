// 1,1から3,4まで階段状に
const walls = [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, true, true]
];//7*7

const start = { x: 1, y: 1 }; // スタート位置
const goal = { x: 2, y: 3 }; // ゴール位置

const isMaze = false; // 迷路かどうか
const mazes = []; // 迷路データは空（迷路ではないため）

const isRandom = false; // ランダムな壁にするどうか
const wallsList = []; // ランダムにする場合の壁の配列
const goals = []; // ランダムにする場合のゴールの配列

const instruction = "<h3>課題１</h3>複数の経路を試してみてください。";

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
