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

export const MACRO_RF_ID = 'macro';
export const DEFAULT_PATH_PARAMETERS = {
    regularity: REGULARITIES.HOUR,
    mode: VIEW_MODE.MAP,
    mapMrfId: MACRO_RF_ID,
    graphMrfId: '9',
    type: undefined,
};

export const FILTERS = [
    {
        id: 'service',
        defaultTitle: 'Сервисы',
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
        defaultTitle: 'Продукт',
        editable: true,
        type: 'radio',
        options: [
            {
                value: 'ITV',
                label: ls('ITV', 'ИТВ'),
                enabled: true,
            }, {
                value: 'ITV2',
                label: ls('ITV2_0', 'ИТВ 2.0'),
            },
        ],
    }, {
        id: 'feature',
        defaultTitle: 'Услуга',
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
        defaultTitle: 'Технология',
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
