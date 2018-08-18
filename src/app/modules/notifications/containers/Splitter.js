class Splitter {
    constructor(avCallback, uiCallback) {
        this._avCallback = avCallback;
        this._uiCallback = uiCallback;
    };

    match = (alert, filter) => {
        return true;
    };

    split = (alerts = [], filter) => {
        const uiAlerts = [];
        const avAlerts = [];
        alerts.forEach(alert => {
            if (this.match(alert, filter)) {
                uiAlerts.push(alert);
            } else {
                avAlerts.push(alert)
            }
        })
    }
}

export default Splitter;