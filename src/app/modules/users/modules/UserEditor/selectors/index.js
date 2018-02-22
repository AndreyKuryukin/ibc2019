import { createSelector } from 'reselect';
import { selectUsersRoot } from '../../../selectors';

export const selectEditor = createSelector(
    selectUsersRoot,
    users => users.editor,
);

export const selectSelectedUser = createSelector(
    selectEditor,
    editor => editor.user,
);

export const selectUserRoles = createSelector(
    selectEditor,
    editor => editor.roles,
);
