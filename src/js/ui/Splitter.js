import Control from "./Control"
import SplitterDirection from "./SplitterDirection"

class Splitter extends Control {
    constructor(parent, direction, minValue, maxValue) {
        super(parent);

        this.direction = direction;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.screenValue = 0;
        this.value = 0;

        this.element = document.createElement("div");
        this.element.className = "splitter-" + direction;
        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));

        this.onDocumentMouseUpHandler = this.onDocumentMouseUp.bind(this);
        this.onDocumentMouseMoveHandler = this.onDocumentMouseMove.bind(this);
    }

    beginResize() {
        document.addEventListener("mouseup", this.onDocumentMouseUpHandler, true);
        document.addEventListener("mousemove", this.onDocumentMouseMoveHandler, true);

        switch(this.direction) {
            case SplitterDirection.HORIZONTAL:
                document.body.style.cursor = "n-resize";
                break;
            case SplitterDirection.VERTICAL:
                document.body.style.cursor = "e-resize";
                break;
        }
    }

    endResize() {
        document.removeEventListener("mouseup", this.onDocumentMouseUpHandler, true);
        document.removeEventListener("mousemove", this.onDocumentMouseMoveHandler, true);
        document.body.style.cursor = "";
    }

    onDocumentMouseUp(e) {
        this.endResize();

        e.preventDefault();
        e.stopPropagation();
    }

    onDocumentMouseMove(e) {
        if (this.direction === SplitterDirection.HORIZONTAL) {
            var dy = e.screenY - this.screenValue;
            var height = parseInt(this.parent.height);

            height -= dy;
            height = Math.max(this.minValue, Math.min(window.innerHeight - this.maxValue, height));

            this.parent.height = height;
            this.screenValue = e.screenY;
            this.value = height;
        }
        else {
            var dx = e.screenX - this.screenValue;
            var width = parseInt(this.parent.width);

            width -= dx;
            width = Math.max(this.minValue, Math.min(window.innerWidth - this.maxValue, width));

            this.parent.width = width;
            this.screenValue = e.screenX;
            this.value = width;
        }

        e.preventDefault();
        e.stopPropagation();
    }

    onMouseDown(e) {
        this.beginResize();

        switch(this.direction) {
            case SplitterDirection.HORIZONTAL:
                this.screenValue = e.screenY;
                break;
            case SplitterDirection.VERTICAL:
                this.screenValue = e.screenX;
                break;
        }

        e.preventDefault();
        e.stopPropagation();
    }
}

export default Splitter;
