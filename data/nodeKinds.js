import { moveUp, moveDown, moveRight, moveLeft, isWallUp, isWallDown, isWallRight, isWallLeft } from "../stage/stage_main.js";


// 処理ノードのデータ
export const process_kinds = [
    {
        label: "前へ",
        fn: moveUp,
        default: true
    },
    {
        label: "後ろへ",
        fn: moveDown
    },
    {
        label: "右へ",
        fn: moveRight
    },
    {
        label: "左へ",
        fn: moveLeft
    }
];

// 分岐ノードのデータ
export const decision_kinds = [
    {
        label: "前に壁",
        fn: isWallUp,
        default: true
    },
    {
        label: "後ろに壁",
        fn: isWallDown
    },
    {
        label: "右に壁",
        fn: isWallRight
    },
    {
        label: "左に壁",
        fn: isWallLeft
    }
];

// ループ開始ノードのデータ
export const loop_start_kinds = [
    {
        label: "1回ループ",
        value: 1,
        default: true
    },
    {
        label: "2回ループ",
        value: 2
    },
    {
        label: "3回ループ",
        value: 3
    },
    {
        label: "4回ループ",
        value: 4
    },
    {
        label: "5回ループ",
        value: 5
    },
    {
        label: "ずっとループ",
        value: 1000
    }
];