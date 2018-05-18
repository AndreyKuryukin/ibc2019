export const FETCH_ALARMS_SUCCESS = 'alarms/FETCH_ALARMS_SUCCESS';
export const fetchAlarmsSuccess = alarms => ({
    type: FETCH_ALARMS_SUCCESS,
    payload: { alarms },
});

export const FETCH_REGIONS_SUCCESS = 'alarms/FETCH_REGIONS_SUCCESS';
export const fetchRegionsSuccess = regions => ({
    type: FETCH_REGIONS_SUCCESS,
    payload: { regions },
});

export const FETCH_LOCATIONS_SUCCESS = 'alarms/FETCH_LOCATIONS_SUCCESS';
export const fetchLocationsSuccess = locations => ({
    type: FETCH_LOCATIONS_SUCCESS,
    payload: { locations },
});