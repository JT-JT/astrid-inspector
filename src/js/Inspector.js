import InlineWindow from "./ui/InlineWindow"

class Inspector {
    constructor(runtime) {
        this.runtime = runtime;
        this.runtime.inspector = this;
        this.window = null;
    }

    run() {
        if (this.window) {
            this.window.open();
            return;
        }

        this.window = new InlineWindow(this);
        this.window.open();
    }
}

export default Inspector;
