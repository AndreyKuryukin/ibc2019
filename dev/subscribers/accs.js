const graph = require('./graphByMacs');
const details = require('./deviceDetails');

module.exports = {
    '714973': {
        'id': '714973',
        'kabByServices': {
            current: graph['714973'][0],
            previous: graph['714973'][1]
        },
        details: details['714973'],
        graph: graph['714973']
    },
    '714974': {
        'id': '714974',
        'kabByServices': {
            current: {...graph['714973'][0], id: '714974'},
            previous: {...graph['714973'][1], id: '714974'},
        },
        details: details['714974'],
        graph: graph['714973']
    },
    '714975': {
        'id': '714975',
        'kabByServices': {
            current: {...graph['714973'][0], id: '714975'},
            previous: {...graph['714973'][1], id: '714976'},
        },
        details: details['714975'],
        graph: graph['714973']
    },
    '714976': {
        'id': '714976',
        'kabByServices': {
            current: {...graph['714973'][0], id: '714976'},
            previous: {...graph['714973'][1], id: '714976'},
        },
        details: details['714976'],
        graph: graph['714973']
    },
    '112233': {
        'id': '112233',
        'kabByServices': {
            current: {
                "id": "112233",
                "common": 98.5,
                "broadband_access": 85.05839,
                "vod": "NaN",
                "pvr": "NaN",
                "channel_switching_time": 100.0,
                "load_time": "NaN",
                "epg": 66.666664,
                "date_time": "2019-03-19T12:00:00"
            },
            previous: {
                "id": "112233",
                "common": 68.96917,
                "broadband_access": 60.87979,
                "vod": "NaN",
                "pvr": 100.0,
                "channel_switching_time": 83.33333,
                "load_time": "NaN",
                "epg": 52.0,
                "date_time": "2019-03-19T11:00:00"
            }
        },
        details: details['112233'],
    },
    '112222': {
        'id': '714976',
        'kabByServices': {
            current: {
                "id": "112222",
                "common": 99.8,
                "broadband_access": 85.05839,
                "vod": "NaN",
                "pvr": "NaN",
                "channel_switching_time": 100.0,
                "load_time": "NaN",
                "epg": 66.666664,
                "date_time": "2019-03-19T12:00:00"
            },
            previous: {
                "id": "112222",
                "common": 99.7,
                "broadband_access": 60.87979,
                "vod": "NaN",
                "pvr": 100.0,
                "channel_switching_time": 83.33333,
                "load_time": "NaN",
                "epg": 52.0,
                "date_time": "2019-03-19T11:00:00"
            }
        },
        details: details['112222'],
    },
};
