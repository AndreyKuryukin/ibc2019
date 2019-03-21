const stbs = require('./stbs');
const accs = require('./accs');
const details = require('./deviceDetails');

module.exports = {
    'AAAAAA': {
        "subscriber_devices": [
            stbs['E4277126BF0B'].details,
            stbs['0045F194AB12'].details,
            stbs['001B23324A56'].details,
        ],
        "topology_devices": [
            accs['714973'].details,
            accs['714974'].details,
            details['112233'],
            details['112222'],
        ]
    },
    'AAAABB': {
        "subscriber_devices": [
            stbs['DEFA4672A173'].details,
            stbs['2938749A3FD1'].details,
            stbs['000012853254'].details,
            stbs['058392937475'].details,
            stbs['DDEFFA45A832'].details,
            stbs['113593799543'].details,
        ],
        "topology_devices": [
            accs['714973'].details,
            accs['714975'].details,
            accs['714976'].details,
            details['112233'],
            details['112222'],
        ]
    }
};
