class Counter {
    constructor() {
        this._callbacks = [];
        this._counter = 0;
        this.decrease = ()=> {
            --this._counter;
            this.resolve();
        };

        this.increase = () => {
            ++this._counter;
        };

        this.resolve = () => {
            if (this._counter < 1) {
                this._callbacks.forEach(cb => cb())
            }
        };

        this.callback = (callback) => {
            this._callbacks.push(callback);
            this.resolve();
        }
    }
}

module.exports = Counter;