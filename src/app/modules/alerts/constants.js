export const GROUP_POLICIES_ALERTS = 'gp';
export const CLIENTS_INCIDENTS_ALERTS = 'ci';
export const KQI_ALERTS = 'kqi';

export const CI_ALERT_TYPE = 'SIMPLE';
export const GROUP_POLICIES_ALERT_TYPE = 'GROUP_AGGREGATION';
export const KQI_ALERT_TYPE = 'KPIKQI';

export const ALERTS_TYPES = [CLIENTS_INCIDENTS_ALERTS, GROUP_POLICIES_ALERTS, KQI_ALERTS];

export const SENDING_ALERT_TYPES = {
    [GROUP_POLICIES_ALERTS]: GROUP_POLICIES_ALERT_TYPE,
    [CLIENTS_INCIDENTS_ALERTS]: CI_ALERT_TYPE,
    [KQI_ALERTS]: KQI_ALERT_TYPE,
};

export const NOTIFICATION_MAX_COUNT = 1000;
export const ALERT_MAX_COUNT = 1000;

export const FILTER_FIELDS = {
    AUTO_REFRESH: 'auto_refresh',
    START: 'start',
    END: 'end',
    RF: 'rf',
    MRF: 'mrf',
    POLICY_ID: 'policyId',
    CURRENT: 'current',
    HISTORICAL: 'historical',
    FILTER: 'filter',
    TYPE: 'type',
};