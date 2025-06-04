// URLパラメータから問題を指定
const params = new URLSearchParams(document.location.search);
const q_num = Number(params.get("q"));

// historyは問題ごとに保存

export function loadHistory(key) {
    const history = localStorage.getItem(q_num + "-" + key);
    if (history) {
        try {
            return JSON.parse(history);
        } catch (e) {
            console.error("Failed to parse history:", e);
            return {};
        }
    }
    return {};
}

export function saveHistory(key, history) {
    // console.log("Saving history:", key, history);
    try {
        localStorage.setItem(q_num + "-" + key, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history:", e);
    }
}

export function clearHistory(key) {
    // console.log("Clearing history:", key);
    localStorage.removeItem(q_num + "-" + key);
}