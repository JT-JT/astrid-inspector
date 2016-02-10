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

    shutdown() {
        if (this.window) {
            this.window.close();
            this.window = null;
        }

        if (this.runtime) {
            this.runtime.inspector = null;
            this.runtime = null;
        }
    }
}

export default Inspector;
