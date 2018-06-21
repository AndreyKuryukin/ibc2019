import ls from '../../../i18n';

export const VIEW_MODE = {
    MAP: 'map',
    GRAPH: 'graph',
};

export const REGULARITIES = {
    HOUR: 'HOUR',
    DAY: 'DAY',
    WEEK: 'WEEK',
};

export const FILTERS = [
    {
        id: 'service',
        title: ls('DASHBOARD_FILTERS_SERVICES_TITLE', 'Сервисы'),
        editable: false,
        options: [
            {
                value: 'IPTV',
                label: ls('IPTV_OTT', 'IPTV/OTT'),
                enabled: true,
            // }, {
            //     value: 'INTERNET',
            //     label: ls('INTERNET', 'INTERNET'),
            // }, {
            //     value: 'VOIP',
            //     label: ls('VOIP', 'VoIP'),
            },
        ],
    }, {
        id: 'product',
        title: ls('DASHBOARD_FILTERS_PRODUCT_TITLE', 'Продукт'),
        editable: true,
        options: [
            {
                value: 'ITV',
                label: ls('ITV', 'ИТВ'),
            }, {
                value: 'ITV2',
                label: ls('ITV2_0', 'ИТВ 2.0'),
            },
        ],
    }, {
        id: 'feature',
        title: ls('DASHBOARD_FILTERS_SERVICE_TITLE', 'Услуга'),
        editable: false,
        options: [
            {
                value: 'LIVE',
                label: ls('LIVE', 'LIVE'),
                enabled: true,
            // }, {
            //     value: 'PVR',
            //     label: ls('PVR', 'PVR'),
            // }, {
            //     value: 'VOD',
            //     label: ls('VOD', 'VOD'),
            },
        ],
    }, {
        id: 'technology',
        title: ls('DASHBOARD_FILTERS_TECH_TITLE', 'Технология'),
        editable: true,
        options: [
            {
                value: 'FTTB',
                label: ls('FTTB', 'FTTB'),
            }, {
                value: 'GPON',
                label: ls('GPON', 'GPON'),
            }, {
                value: 'XDSL',
                label: ls('XDSL', 'XDSL'),
            },
        ],
    },
];
