import React from 'react';
import { connect } from 'react-redux';
import RoleEditor from '../components';
import { selectSelectedRole, selectSourceOptions, selectSubjectsByRole } from '../selectors';
import { submitRole } from '../../../actions';

const mapStateToProps = state => ({
    role: selectSelectedRole(state),
    sourceOptions: selectSourceOptions(state),
    subjectsByRole: selectSubjectsByRole(state),
});
const mapDispatchToProps = dispatch => ({
    onSubmit: (roleId, role) => {
        submitRole(dispatch, roleId, role);
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
