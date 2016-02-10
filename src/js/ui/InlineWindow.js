import Window from "./Window"
import Splitter from "./Splitter"
import SplitterDirection from "./SplitterDirection"

class InlineWindow extends Window {
    constructor(inspector) {
        super(inspector);

        this.element = document.createElement("div");
        this.element.className = "window-inline";
        this.splitter = new Splitter(this, SplitterDirection.HORIZONTAL, 112, 42);
        this.add(this.splitter);

        this.createWindow(this);
    }

    focus() {

    }

    open() {
        this.height = Math.max(window.innerHeight - 42, 112);

        document.body.appendChild(this.element);

        this.state.isOpen = true;
        this.state.isVisible = true;
        this.show();
    }

    close() {
        if (!this.element) {
            return;
        }

        document.body.removeChild(this.element);
        this.element = null;

        this.state.isOpen = false;
        this.state.isVisible = false;
    }

    show() {
        this.element.style.display = "";
        this.state.isVisible = true;
    }

    hide() {
        this.element.style.display = "none";
        this.state.isVisible = false;
    }

    onSizeChanged() {
        this.element.style.height = this.height + "px";
    }
}

export default InlineWindow;
