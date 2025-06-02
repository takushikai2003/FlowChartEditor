export class Node{
    constructor(id, type, label, x, y, el) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.x = x; // x-coordinate for rendering
        this.y = y; // y-coordinate for rendering
        this.el = el;
        this.data = {};
    }

    updateLabel(newLabel) {
        this.label = newLabel;
        if (this.el) {
            this.el.querySelector('.node-label').textContent = newLabel;
        }
    }


    setData(key, value) {
        this.data[key] = value;
    }
    getData(key) {
        return this.data[key];
    }
}