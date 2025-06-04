// 処理ノードのデータ
export const process_kinds = [
    {
        label: "上へ",
        fnName: "moveUp",
        default: true
    },
    {
        label: "下へ",
        fnName: "moveDown"
    },
    {
        label: "右へ",
        fnName: "moveRight"
    },
    {
        label: "左へ",
        fnName: "moveLeft"
    }
];

// 分岐ノードのデータ
export const decision_kinds = [
    {
        label: "上に壁",
        fnName: "isWallUp",
        default: true
    },
    {
        label: "下に壁",
        fnName: "isWallDown"
    },
    {
        label: "右に壁",
        fnName: "isWallRight"
    },
    {
        label: "左に壁",
        fnName: "isWallLeft"
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