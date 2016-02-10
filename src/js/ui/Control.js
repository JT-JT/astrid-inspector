
class Control {
    constructor(parent) {
        this.parent = parent;
        this.element = null;
    }

    get width() {
        return this.element.style.width;
    }

    set width(value) {
        this.element.style.width = value + "px";
    }

    get height() {
        return this.element.style.height;
    }

    set height(value) {
        this.element.style.height = value + "px";
    }

    add(child) {
        if (this.element) {
            this.element.appendChild(child.element);
        }
    }

    remove(child) {
        if (this.element) {
            this.element.removeChild(child.element);
        }
    }
}

export default Control;
