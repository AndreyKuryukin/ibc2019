const moment = require('moment');

const randomize = (values, index) => {
    const metrics = Object.keys(values);
    const { AVG, MIN, MAX } = values;
    const multiplier = (Math.min(MAX - AVG, AVG - MIN) + Math.max(MAX - AVG, AVG - MIN)) / 2;
    if (MAX === AVG && AVG === MIN && MAX === MIN) {
        return values;
    }
    return metrics.reduce((result, name, i) => {
        result[name] = values[name] + Number((multiplier * Math.abs(Math.sin((index + i) / (index - i + 3) + values[name] / (multiplier + 1)))).toFixed(1));
        return result;
    }, {})
};


module.exports = {
    get vidDecodeErrors() {
        const count = 47;
        const result = {};
        const baseValues = Object.values(this._vidDecodeErrors);
        for (let i = 0; i < count; i++) {
            const date = moment().subtract(i * 3, 'hours').toISOString();
            const values = randomize(baseValues[i % 8], i);
            result[date] = values
        }
        return result
    },
    get bufUnderruns() {
        const count = 63;
        const result = {};
        const baseValues = Object.values(this._bufUnderruns);
        for (let i = 0; i < count; i++) {
            const date = moment().subtract(i * 3, 'hours').toISOString();
            const values = randomize(baseValues[i % 8], i);
            result[date] = values
        }
        return result
    },
    get linkFaults() {
        const count = 27;
        const result = {};
        const baseValues = Object.values(this._linkFaults);
        for (let i = 0; i < count; i++) {
            const date = moment().subtract(i * 3, 'hours').toISOString();
            const values = randomize(baseValues[i % 8], i);
            result[date] = values
        }
        return result
    },
    _vidDecodeErrors: {
        "2019-04-05T10:41:45Z": { "AVG": 1.5, "MIN": 1, "MAX": 2 },
        "2019-04-05T11:35:06Z": { "AVG": 2, "MIN": 1, "MAX": 3 },
        "2019-04-05T12:07:29Z": { "AVG": 3.5, "MIN": 1, "MAX": 6 },
        "2019-04-05T13:15:00Z": { "AVG": 3, "MIN": 2, "MAX": 4 },
        "2019-04-05T14:22:11Z": { "AVG": 5, "MIN": 3, "MAX": 7 },
        "2019-04-05T15:43:59Z": { "AVG": 2, "MIN": 0, "MAX": 4 },
        "2019-04-05T16:50:59Z": { "AVG": 2, "MIN": 0, "MAX": 4 },
        "2019-04-05T17:47:59Z": { "AVG": 4, "MIN": 3, "MAX": 5 },
    },
    _bufUnderruns: {
        "2019-04-05T10:41:45Z": { "AVG": 1329.0, "MIN": 1329, "MAX": 1329 },
        "2019-04-05T11:35:06Z": { "AVG": 165, "MIN": 165, "MAX": 165 },
        "2019-04-05T12:07:29Z": { "AVG": 2394, "MIN": 2123, "MAX": 2456 },
        "2019-04-05T13:15:00Z": { "AVG": 1245, "MIN": 987, "MAX": 1412 },
        "2019-04-05T14:22:11Z": { "AVG": 2514, "MIN": 1614, "MAX": 2800 },
        "2019-04-05T15:43:59Z": { "AVG": 870, "MIN": 512, "MAX": 1001 },
        "2019-04-05T16:50:59Z": { "AVG": 732, "MIN": 437, "MAX": 941 },
        "2019-04-05T17:47:59Z": { "AVG": 1167, "MIN": 870, "MAX": 1422 },
    },
    _linkFaults: {
        "2019-04-05T10:41:45Z": { "AVG": 3, "MIN": 0, "MAX": 6 },
        "2019-04-05T11:35:06Z": { "AVG": 7.5, "MIN": 4, "MAX": 14 },
        "2019-04-05T12:07:29Z": { "AVG": 8, "MIN": 3, "MAX": 10 },
        "2019-04-05T13:15:00Z": { "AVG": 5, "MIN": 2, "MAX": 7 },
        "2019-04-05T14:22:11Z": { "AVG": 9, "MIN": 5, "MAX": 12 },
        "2019-04-05T15:43:59Z": { "AVG": 3, "MIN": 1, "MAX": 7 },
        "2019-04-05T16:50:59Z": { "AVG": 2, "MIN": 1, "MAX": 6 },
        "2019-04-05T17:47:59Z": { "AVG": 3, "MIN": 1, "MAX": 5 },
    },
};