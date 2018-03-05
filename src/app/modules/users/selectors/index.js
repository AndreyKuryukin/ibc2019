import { createSelector } from 'reselect';
import ls from 'i18n';

export const selectUsersRoot = state => state.users;
export const selectUsers = state => selectUsersRoot(state).users;

const selectUsersList = createSelector(
    selectUsers,
    users => users.list.map(id => users.byId[id]),
);

const formatActiveStatus = disabled => disabled ? ls('YES', 'Нет') : ls('NO', 'Да');

const getUserRow = user => ({
    id: user.id,
    login: user.login,
    name: user.first_name,
    email: user.email,
    phone: user.phone,
    active: formatActiveStatus(user.disabled),
});

export const selectUsersData = createSelector(
    selectUsersList,
    users => users.map(getUserRow),
);
