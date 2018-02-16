import { createSelector } from 'reselect';
import _ from 'lodash';
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

export const selectSubjectsByRole = createSelector(
    selectRolesData,
    roles => roles.reduce((result, { id, subjects }) => ({ ...result, [id]: subjects }), {})
);
