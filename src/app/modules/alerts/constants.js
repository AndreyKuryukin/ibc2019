export const GROUP_POLICIES_ALERTS = 'gp';
export const CLIENTS_INCIDENTS_ALERTS = 'ci';
export const KQI_ALERTS = 'kqi';

export const ALERTS_TYPES = [GROUP_POLICIES_ALERTS, CLIENTS_INCIDENTS_ALERTS, KQI_ALERTS];

export const SENDING_ALERT_TYPES = {
    [GROUP_POLICIES_ALERTS]: 'GROUP_AGGREGATION',
    [CLIENTS_INCIDENTS_ALERTS]: 'SIMPLE',
    [KQI_ALERTS]: 'KPIKQI',
};

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
};