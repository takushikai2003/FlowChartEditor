function go_forward() {
    return "前へ";
}
function go_backward() {
    return "後ろへ";
}
function go_right() {
    return "右へ";
}
function go_left() {
    return "左へ";
}

function is_wall_front() {
    return true;
}
function is_wall_back() {
    return true;
}
function is_wall_right() {
    return true;
}
function is_wall_left() {
    return true;
}


// 処理ノードのデータ
export const process_kinds = [
    {
        label: "前へ",
        fn: go_forward,
        default: true
    },
    {
        label: "後ろへ",
        fn: go_backward
    },
    {
        label: "右へ",
        fn: go_right
    },
    {
        label: "左へ",
        fn: go_left
    }
];

// 分岐ノードのデータ
export const decision_kinds = [
    {
        label: "前に壁",
        fn: is_wall_front,
        default: true
    },
    {
        label: "後ろに壁",
        fn: is_wall_back
    },
    {
        label: "右に壁",
        fn: is_wall_right
    },
    {
        label: "左に壁",
        fn: is_wall_left
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