import PropTypes from 'prop-types';
import {createSelector} from 'reselect';
import rest from '../../rest';

export const getRegionName = shortName => ({
    ct: 'Центр',
    dv: 'Дальний Восток',
    mos: 'Москва',
    nw: 'Северо-Запад',
    sib: 'Сибирь',
    sth: 'Юг',
    ural: 'Урал',
    vlg: 'Волга',
}[shortName] || shortName);

export const MRFPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
});
export const RFPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
});
export const CountyPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
});


const initialState = {
    data: {
        mrfList: [],
        mrfById: {},
        rfList: [],
        rfById: {},
        rfByMrf: {},
        countyList: [],
        countyById: {},
        countyByRf: {},
    },
    isLoading: false,
};

const FETCH_LOCATION = 'common/location/FETCH';
export function fetchLocation(dispatch) {
    dispatch({type: FETCH_LOCATION});

    rest.get('/api/v1/common/location')
        .then(
            response => dispatch(fetchLocationSuccess(response.data)),
            () => dispatch(fetchLocationError())
        );
}
const FETCH_LOCATION_SUCCESS = 'common/location/FETCH_SUCCESS';
export function fetchLocationSuccess(tree) {
    return {type: FETCH_LOCATION_SUCCESS, payload: {tree}};
}
const FETCH_LOCATION_ERROR = 'common/location/FETCH_ERROR';
export function fetchLocationError() {
    return {type: FETCH_LOCATION_ERROR};
}

const r = state => state.common.location;
export function selectMRFMap(state) {
    return r(state).data.mrfById;
}
export function selectRFMap(state) {
    return r(state).data.rfById;
}
export function selectCountyMap(state) {
    return r(state).data.countyById;
}
export function selectMRFList(state) {
    const map = selectMRFMap(state);
    return r(state).data.mrfList.map(id => map[id]);
}
export function selectRFList(state) {
    const map = selectRFMap(state);
    return r(state).data.rfList.map(id => map[id]);
}
export function selectCountyList(state) {
    const map = selectCountyMap(state);
    return r(state).data.countyList.map(id => map[id]);
}
function buildTree(data, depth) {
    if (depth === 0) return [];

    const {mrfList, mrfById, rfById, rfByMrf, countyById, countyByRf} = data;

    return mrfList.map(mrfId => ({
        ...mrfById[mrfId],
        rf: depth > 1 ? rfByMrf[mrfId].map(rfId => ({
            ...rfById[rfId],
            counties: depth > 2 ? countyByRf[rfId].map(countyId => countyById[countyId]) : [],
        })) : [],
    }));
}
export const selectTree = createSelector(
    r,
    (state, {depth = Infinity} = {}) => depth,
    ({data}, depth) => buildTree(data, depth)
);


function normalize(mrfTree) {
    const mrfList = [];
    const mrfById = {};
    const rfList = [];
    const rfById = {};
    const rfByMrf = {};
    const countyList = [];
    const countyById = {};
    const countyByRf = {};

    for (const mrf of mrfTree) {
        mrfList.push(mrf.id);
        mrfById[mrf.id] = {
            ...mrf,
            shortName: getRegionName(mrf.short_name),
        };
        rfByMrf[mrf.id] = [];

        for (const rf of mrf.rf) {
            rfList.push(rf.id);
            rfById[rf.id] = rf;
            rfByMrf[mrf.id].push(rf.id);
            countyByRf[rf.id] = [];

            for (const county of rf.counties) {
                countyList.push(county.id);
                countyById[county.id] = county;
                countyByRf[rf.id].push(county.id);
            }
        }
    }

    return {
        mrfList,
        mrfById,
        rfList,
        rfById,
        rfByMrf,
        countyList,
        countyById,
        countyByRf,
    };
}


export default function commonLocationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LOCATION: return {
            ...state,
            data: initialState.data,
            isLoading: true,
        };
        case FETCH_LOCATION_SUCCESS: return {
            ...state,
            data: normalize(action.payload.tree),
            isLoading: false,
        };
        case FETCH_LOCATION_ERROR: return {
            ...state,
            isLoading: false,
        };
        default: return state;
    }
}
