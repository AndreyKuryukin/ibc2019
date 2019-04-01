const moment = require("moment");
const _ = require("lodash");

const alertDetails = require('./alertsDeatils');

const alerts = {
    '714974': [{
        "id": "454756745-3e75-454-a175-5676347457",
        "raise_time": "2019-03-21T11:21:56.675",
        "cease_time": "2019-03-21T11:28:56.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "444247098:69",
        "external_id": "",
        "mac": "E4277126BF0B",
        "type": "KQI",
        "object_type": "STB"
    }, {
        "id": "a255470e-d85a-3ed6-94e0-d1e6fa3ba7db",
        "raise_time": "2019-03-21T11:47:56.675",
        "duration": 1620000,
        "policy_name": "TEST.GP",
        "policy_id": "411500054459613185",
        "mrf": "69",
        "rf": "300006",
        "closed": false,
        "object": "257777318:69",
        "external_id": "",
        "mac": "E4277126BF0B",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-34563-edb45-4545fad3546",
        "raise_time": "2019-03-21T16:31:56.675",
        "cease_time": "2019-03-21T16:54:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "E4277126BF0B",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "565465-3e75-3d456703-a175-4564575675",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:38:56.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "444247098:69",
        "external_id": "",
        "mac": "0045F194AB12",
        "type": "KQI",
        "object_type": "STB"
    }],
    '714975': [{
        "id": "34645645-4565-3d03-a175-4564456456",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:38:56.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "444247098:69",
        "external_id": "",
        "mac": "DEFA4672A173",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "34645645-4565-3d03-a175-029840293840",
        "raise_time": "2019-03-20T18:37:56.675",
        "cease_time": "2019-03-20T19:00:34.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "444247098:69",
        "external_id": "",
        "mac": "DEFA4672A173",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "abfc493493-34577-66653-6766-690253",
        "raise_time": "2019-03-20T22:11:21.675",
        "cease_time": "2019-03-20T22:19:32.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "444247098:69",
        "external_id": "",
        "mac": "DEFA4672A173",
        "type": "KQI",
        "object_type": "STB"
    }, {
        "id": "4563434-4564-3d03-a175-685463495445",
        "raise_time": "2019-03-21T11:31:56.675",
        "duration": 121113693,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": false,
        "object": "444247098:69",
        "external_id": "",
        "mac": "DEFA4672A173",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "a255470e-d85a-3ed6-94e0-237dfbc839",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:48:56.675",
        "duration": 1620000,
        "policy_name": "TestGPAcc",
        "policy_id": "411500054459613185",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "257777318:69",
        "external_id": "",
        "mac": "2938749A3FD1",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-9357934903",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:41:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "000012853254",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-87676897abdb86",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:41:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "058392937475",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-923792837adfca343",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:41:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "000012853254",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-283gdbac237492",
        "raise_time": "2019-03-21T12:31:56.675",
        "cease_time": "2019-03-21T12:41:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "058392937475",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-2565656543",
        "raise_time": "2019-03-21T11:51:56.675",
        "cease_time": "2019-03-21T11:55:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "DDEFFA45A832",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "beaf72aa-f59a-3586-9edb-345345345345",
        "raise_time": "2019-03-21T11:31:56.675",
        "cease_time": "2019-03-21T11:41:56.675",
        "duration": 1278432893,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "SAN=0305044494, Л/С=358012555307",
        "external_id": "",
        "san": "0305044494",
        "nls": "358012555307",
        "mac": "113593799543",
        "type": "KQI",
        "object_type": "STB"
    }],
    '714976': [{
        "id": "1131787d-4c5c-3ec8-a599-fb98c30e1faf",
        "raise_time": "2019-03-21T17:26:47.575",
        "duration": 1278432894,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": false,
        "object": "SAN=030514961064, Л/С=358020014364",
        "external_id": "",
        "san": "030514961064",
        "nls": "358020014364",
        "mac": "058392937475",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "ba4012d8-9188-3c8f-9843-cdd885e67508",
        "raise_time": "2019-03-21T17:26:47.575",
        "duration": 1278432894,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": false,
        "object": "SAN=03050423876, Л/С=358010365073",
        "external_id": "",
        "san": "03050423876",
        "nls": "358010365073",
        "mac": "2938749A3FD1",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "d3eaf742-9186-3984-858e-22e542dacc71",
        "raise_time": "2019-03-21T12:07:26.775",
        "cease_time": "2019-03-21T12:16:26.775",
        "duration": 540000,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "209263432:69",
        "external_id": "",
        "mac": "2938749A3FD1",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }, {
        "id": "d58b8d9b-4bd6-3681-8df0-c4432051243d",
        "raise_time": "2019-03-21T17:26:47.575",
        "duration": 1278432894,
        "policy_name": "TEST.STB",
        "policy_id": "429658347419664387",
        "mrf": "69",
        "rf": "300006",
        "closed": false,
        "object": "SAN=03053687143, Л/С=358010394273",
        "external_id": "",
        "san": "03053687143",
        "nls": "358010394273",
        "mac": "DDEFFA45A832",
        "type": "SIMPLE",
        "object_type": "STB"
    }, {
        "id": "043391aa-0974-3e01-9211-358d658d13d4",
        "raise_time": "2019-03-21T11:55:26.775",
        "cease_time": "2019-03-21T12:08:26.775",
        "duration": 780000,
        "policy_name": "TEST",
        "policy_id": "432118345211314179",
        "mrf": "69",
        "rf": "300006",
        "closed": true,
        "object": "388715471:69",
        "external_id": "",
        "mac": "DDEFFA45A832",
        "type": "GROUP_AGGREGATION",
        "object_type": "STB"
    }]
};

const actualize = (alert) => {
    const duration = (moment(alert.cease_time || moment()).unix() - moment(alert.raise_time).unix()) * 1000;
    const raise_time_delta = (moment(alert.raise_time).unix() - moment(alert.raise_time).startOf('hour').unix()) * 1000;
    const raise_time = moment(moment().subtract(1, 'hour').unix() * 1000 + raise_time_delta).toISOString();
    const beta_cease_time = moment(raise_time).unix() * 1000 + duration;
    const cease_time = moment(moment(beta_cease_time).isAfter(moment()) ? moment().subtract(1, 'minute') : beta_cease_time).toISOString();
    alert.raise_time = raise_time;
    if (alert.cease_time) {
        alert.cease_time = cease_time;
    }
    return alert;
};

const enrichAlert = (alert) => {
    const attributes = {
        "SUPPRESSION_TIMEOUT": "0",
        "DEVICE_IP": "10.52.170.168",
        "MAC": `${alert.mac}`,
        "POLICY_NAME": `${alert.policy_name}`,
        "DEVICE_ID": "216213384",
        "CHECK_COUNT": "1",
        "DEVICE_TYPE": "ACC",
        "POLICY_TYPE": "SMART_SPY_ACC_DEVICE",
        "POLICY_OBJECT_TYPE": `${alert.object_type}`,
        "AGG_DEVICE_ID": "422970851",
        "STATE": alert.cease_time ? 'CEASE' : 'RAISE',
        "PE_DEVICE_ID": "422970851",
        "POLICY_ID": "432118345211314179",
        "SUPPRESSION_STATUS": "SENT",
        "REGION_ID": "9",
        "POLICY_TEXT_TEMPLATE": "DEVICE_NAME: ${DEVICE_NAME}, DEVICE_IP: ${DEVICE_IP}, AFFILIATE_ID: ${AFFILIATE_ID}",
        "MRF_NAME": "REGION9"
    };
    alert.attributes = attributes;
    alert['notification_text'] = `Policy "${alert.policy_name}" incident accured on ${alert.mac}`;
    alert.notified = [{
        type: 'SMS',
        status: 'SUCCESS'
    }, {
        type: 'EMAIL',
        status: 'SUCCESS'
    }];
    return alert
};

const alertsById = () => _.reduce(alerts, (result, alerts, mac) => ({
    ...result,
    ...alerts.reduce((res, alert) => {
        res[alert.id] = enrichAlert(alert);
        return res
    }, {})
}), {});

module.exports = Object.keys(alerts).reduce((result, mac) => {
    return {
        ...result,
        get [mac]() {
            return alerts[mac].map(actualize)
        }
    }
}, {
    alertsById: alertsById()
});
