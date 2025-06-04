export function loadHistory(key) {
    // console.log("Loading history:", key);
    const history = localStorage.getItem(key);
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
        localStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history:", e);
    }
}