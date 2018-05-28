import ls from "i18n";

export const GROUPING_TYPES = {
    NONE: 'NONE',
    SELF: 'SELF',
};

export const EQUIPMENT_TYPE_GROUPING = {
    NONE: GROUPING_TYPES.NONE,
    SELF: GROUPING_TYPES.SELF,
    SW: 'SW',
};

export const ABONENT_GROUP_GROUPING = {
    SELF: GROUPING_TYPES.SELF,
    ABONENT: 'ABONENT',
};

export const SERVICE_TYPES = {
    IPTV: 'IPTV',
    WBA: 'WBA',
};

export const DATE_TIME_GROUPING = {
    DAY: ls('DAY_GROUPING', 'Дням'),
    HOUR: ls('HOUR_GROUPING', 'Часам'),
    WEEK: ls('WEEK_GROUPING', 'Неделям'),
};

export const LOCATION_GROUPING = {
    RF: 'РФ',
    MRF: 'МРФ',
};

export const LAST_MILE_TECHNOLOGIES = {
    FTTB: 'FTTB',
    GPON: 'GPON',
    XDSL: 'xDSL',
};

export const LAST_INCH_TECHNOLOGIES = {
    WIFI: 'WiFi',
    LAN: 'LAN',
};

export const INTERVALS = {
    DAY: 'DAY',
    HOUR: 'HOUR',
    WEEK: 'WEEK',
    OTHER: 'OTHER',
};
