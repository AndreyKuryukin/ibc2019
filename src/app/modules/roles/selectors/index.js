import { createSelector } from 'reselect';

export const selectRolesRoot = state => state.roles;
export const selectRoles = state => selectRolesRoot(state).roles;

export const selectRolesData = createSelector(
    selectRoles,
    roles => roles.list.map(id => roles.byId[id]),
);
