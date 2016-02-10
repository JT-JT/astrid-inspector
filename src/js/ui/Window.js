import Control from "./Control"

class Window extends Control {
    constructor(inspector) {
        super(null);

        this.inspector = inspector;

        this.root = null;
        this.toolbar = null;
        this.content = null;

        this.state = {
            isOpen: false,
            isVisible: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }

    get isOpen() {
        return this.state.isOpen;
    }

    get isVisible() {
        return this.state.isVisible;
    }

    get x() {
        return this.state.x;
    }

    set x(value) {
        if (this.state.x !== value) {
            this.state.x = value;
            this.onPositionChanged();
        }
    }

    get y() {
        return this.state.y;
    }

    set y(value) {
        if (this.state.y !== value) {
            this.state.y = value;
            this.onPositionChanged();
        }
    }

    get width() {
        return this.state.width;
    }

    set width(value) {
        if (this.state.width !== value) {
            this.state.width = value;
            this.onSizeChanged();
        }
    }

    get height() {
        return this.state.height;
    }

    set height(value) {
        if (this.state.height !== value) {
            this.state.height = value;
            this.onSizeChanged();
        }
    }

    createWindow(host) {
        this.root = document.createElement("div");
        this.root.className = "window";
        this.toolbar = null;

        this.content = new Control(this);
        this.content.element = document.createElement("div");
        this.content.element.className = "window-content";
        this.root.appendChild(this.content.element);

        if (host) {
            host.element.appendChild(this.root);
        }
        else {
            document.body.appendChild(this.root);
        }
    }

    focus() {

    }

    open() {

    }

    close() {

    }

    show() {

    }

    hide() {

    }

    onPositionChanged() {
    }

    onSizeChanged() {
    }
}

export default Window;
