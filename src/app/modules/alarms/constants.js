export const GROUP_POLICIES_ALARMS = 'gp';
export const CLIENTS_INCIDENTS_ALARMS = 'ci';
export const KQI_ALARMS = 'kqi';

export const ALARMS_TYPES = [GROUP_POLICIES_ALARMS, CLIENTS_INCIDENTS_ALARMS, KQI_ALARMS];

export const SENDING_ALARM_TYPES = {
    [GROUP_POLICIES_ALARMS]: 'GROUP_AGGREGATION',
    [CLIENTS_INCIDENTS_ALARMS]: 'SIMPLE',
    [KQI_ALARMS]: 'KPIKQI',
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