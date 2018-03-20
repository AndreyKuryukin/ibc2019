import { createSelector } from 'reselect';
import ls from 'i18n';

export const selectUsersRoot = state => state.users;
export const selectUsers = state => selectUsersRoot(state).users;

export const selectUsersList = createSelector(
    selectUsers,
    users => users.list.map(id => users.byId[id]),
);
