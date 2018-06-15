import { createSelector } from 'reselect';
import { selectRolesRoot, selectRolesData } from '../../../selectors';

export const selectEditor = createSelector(
    selectRolesRoot,
    roles => roles.editor,
);

export const selectSelectedRole = createSelector(
    selectEditor,
    editor => editor.role,
);

export const selectSubjects = createSelector(
    selectEditor,
    editor => editor.subjects.map(subject => ({ id: subject, name: subject })),
);

export const selectSourceOptions = createSelector(
    selectRolesData,
    roles => roles.map(role => [role.id, role.name]),
);


