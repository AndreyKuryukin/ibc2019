import qs from 'query-string'

export const setQueryParams = (params, history, location) => history.push({
    pathname: location.pathname,
    search: qs.stringify(params)
});

export const getQueryParams = location => qs.parse(location.search);