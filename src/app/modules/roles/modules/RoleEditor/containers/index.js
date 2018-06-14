import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import RoleEditorComponent from '../components';
import { selectSelectedRole, selectSourceOptions, selectSubjects, selectSubjectsByRole } from '../selectors';
import { createRole, updateRole } from '../../../actions';
import { fetchRoleSuccess, fetchSubjectsSuccess, resetRolesEditor, fetchAccessLevelTypesSuccess } from '../actions';
import rest from '../../../../../rest';
import { validateForm } from "../../../../../util/validation";

class RoleEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        roleId: PropTypes.string,
        onUpdateRoleSuccess: PropTypes.func,
        onCreateRoleSuccess: PropTypes.func,
        onFetchRoleSuccess: PropTypes.func,
        resetRolesEditor: PropTypes.func,
        onFetchAccessLevelTypesSuccess: PropTypes.func,
    };

    static defaultProps = {
        roleId: null,
        onUpdateRoleSuccess: () => null,
        onCreateRoleSuccess: () => null,
        onFetchRoleSuccess: () => null,
        onFetchAccessLevelTypesSuccess: () => null,
        resetRolesEditor: () => null,
    };

    state = {
        errors: null,
        isLoading: false,
    };

    validationConfig = {
        name: {
            required: true
        },
    };

    componentDidMount() {
        let isRoleLoading = false;
        let isSubjectAndTypesLoading = true;
        const stopLoading = () => {
            if (!isRoleLoading && !isSubjectAndTypesLoading) {
                this.setState({ isLoading: false });
            }
        };

        this.setState({ isLoading: true });
        if (this.props.roleId) {
            isRoleLoading = true;
            const urlParams = {
                roleId: this.props.roleId,
            };
            rest.get('/api/v1/role/:roleId', { urlParams })
                .then((roleResponse) => {
                    const role = roleResponse.data;
                    this.props.onFetchRoleSuccess(role);
                    isRoleLoading = false;
                    stopLoading();
                })
                .catch((e) => {
                    console.log(e);
                    isRoleLoading = false;
                    stopLoading();
                });
        }

        Promise.all([rest.get('/api/v1/subject'), rest.get('/api/v1/accessLevel/types')])
            .then(([subjectResponse, accessLevelResponse]) => {
                this.props.onFetchSubjectsSuccess(subjectResponse.data);
                this.props.onFetchAccessLevelTypesSuccess(accessLevelResponse.data);
                isSubjectAndTypesLoading = false;
                stopLoading();
            })
            .catch((e) => {
                console.log(e);
                isSubjectAndTypesLoading = false;
                stopLoading();
            });

        this.context.pageBlur && this.context.pageBlur(true);
    }

    onSubmit = (roleId, roleData) => {
        const errors = validateForm({
            ...roleData,
            name: roleData.name.trim(),
        }, this.validationConfig);
        if (_.isEmpty(errors)) {
            const submit = roleId ? rest.put : rest.post;
            const success = (response) => {
                const callback = roleId ? this.props.onUpdateRoleSuccess : this.props.onCreateRoleSuccess;
                const role = response.data;
                callback(role);
                this.context.history.push('/users-and-roles/roles');
            };

            submit('/api/v1/role', roleData)
                .then(success)
                .catch((e) => {
                    console.error(e);
                });
        } else {
            this.setState({ errors });
        }
    };

    render() {
        return (
            <RoleEditorComponent
                onSubmit={this.onSubmit}
                errors={this.state.errors}
                onClose={this.props.resetRolesEditor}
                isLoading={this.state.isLoading}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
    role: selectSelectedRole(state),
    sourceOptions: selectSourceOptions(state),
    subjectsByRole: selectSubjectsByRole(state),
    subjectsData: _.get(state, 'roles.editor.subjects', []),
    accessLevelTypes: _.get(state, 'roles.editor.access_level_types', []),
});

const mapDispatchToProps = dispatch => ({
    onFetchRoleSuccess: role => dispatch(fetchRoleSuccess(role)),
    onCreateRoleSuccess: role => dispatch(createRole(role)),
    onUpdateRoleSuccess: role => dispatch(updateRole(role)),
    onFetchSubjectsSuccess: subjects => dispatch(fetchSubjectsSuccess(subjects)),
    onFetchAccessLevelTypesSuccess: types => dispatch(fetchAccessLevelTypesSuccess(types)),
    resetRolesEditor: () => dispatch(resetRolesEditor()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
