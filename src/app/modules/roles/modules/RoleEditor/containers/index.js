import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import RoleEditorComponent from '../components';
import { selectSelectedRole, selectSourceOptions } from '../selectors';
import { selectRolesData } from '../../../selectors';
import { createRole, updateRole } from '../../../actions';
import { fetchRoleSuccess, fetchSubjectsSuccess, resetRolesEditor } from '../actions';
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
    };

    static defaultProps = {
        roleId: null,
        onUpdateRoleSuccess: () => null,
        onCreateRoleSuccess: () => null,
        onFetchRoleSuccess: () => null,
        resetRolesEditor: () => null,
    };

    state = {
        errors: null,
    };

    validationConfig = {
        name: {
            required: true
        },
    };

    mapLevels = (level = '') => {
        switch (level.toUpperCase()) {
            case 'EDIT': {
                return ['EDIT']
            }
            case 'ALL': {
                return ['EDIT', 'VIEW']
            }
            case 'VIEW': {
                return ['VIEW']
            }
            default:
                return []
        }
    };

    mapAccessLevel = (accessLevel) => {
        const subject = _.get(accessLevel, 'subject', []);
        return {
            name: subject.name.toUpperCase(),
            access_level: this.mapLevels(_.get(accessLevel, 'access_level_type', ''))
        }
    };

    mapRoleToSubjects = (role) => _.get(role, 'access_level', []).map(this.mapAccessLevel);

    mapRoleSubjects = (role) => {
        const roleSubjects = this.mapRoleToSubjects(role);
        const subjectMap = _.reduce(roleSubjects, (subjects, subject) => {
            if (_.isEmpty(subjects[subject.name])) {
                subjects[subject.name] = []
            }
            subjects[subject.name] = _.uniq(subjects[subject.name].concat(subject.access_level));
            return subjects
        }, {});
        return _.reduce(subjectMap, (userSubjects, access_level, name) => {
            userSubjects.push({ name, access_level });
            return userSubjects
        }, []);
    };

    mapSubjects = (subjects) => subjects.map(subj => ({ ...subj, access_level: ['EDIT', 'VIEW'] }));

    componentDidMount() {
        if (this.props.roleId) {
            const urlParams = {
                roleId: this.props.roleId,
            };
            this.setState({ isLoading: true });
            Promise.all([rest.get('/api/v1/role/:roleId', { urlParams }), rest.get('/api/v1/subject')])
                .then(([roleResponse, subjectResponse]) => {
                    const role = {
                        ...roleResponse.data,
                        subjects: this.mapRoleSubjects(roleResponse.data),
                    };

                    const subjects = this.mapSubjects(subjectResponse.data);
                    this.props.onFetchSubjectsSuccess(subjects);
                    this.props.onFetchRoleSuccess(role);
                    this.setState({ isLoading: false });
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                })
            ;
        } else {
            rest.get('/api/v1/subject')
                .then(response => {
                    this.setState({ isLoading: false });
                    this.props.onFetchSubjectsSuccess(this.mapSubjects(response.data));
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                })
        }
        this.context.pageBlur && this.context.pageBlur(true);
    }

    mapAccessLevels = (access_level = []) => {
        if (access_level.length === 0) {
            return 'NONE'
        } else if (access_level.length === 1) {
            return access_level[0];
        } else {
            return 'ALL'
        }
    };

    mapSubjectsToAccesslevel = subjects => subjects.map(subj => ({
        access_level_type: this.mapAccessLevels(subj.access_level),
        subject: _.omit(subj, 'access_level')
    }));


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
                this.props.resetRolesEditor();
            };
            const role = {
                ..._.pick(roleData, ['id', 'name', 'description']),
                access_level: this.mapSubjectsToAccesslevel(roleData.subjects)
            };
            submit('/api/v1/role', role)
                .then(success)
                .catch((e) => {
                    console.error(e);
                });
        } else {
            this.setState({ errors });
        }
    };

    mapRoles = (roles) => {
        return _.reduce(roles, (rolesObj, role) => {
            rolesObj[role.id] = this.mapRoleSubjects(role);
            return rolesObj
        }, {})
    };

    render() {
        const { resetRolesEditor, subjectsByRole = [], ...rest } = this.props;
        const allRoles = this.mapRoles(subjectsByRole);
        return (
            <RoleEditorComponent
                onSubmit={this.onSubmit}
                errors={this.state.errors}
                onClose={resetRolesEditor}
                subjectsByRole={allRoles}
                {...rest}
            />
        );
    }
}

const mapStateToProps = state => ({
    role: selectSelectedRole(state),
    sourceOptions: selectSourceOptions(state),
    subjectsByRole: selectRolesData(state),
    subjectsData: _.get(state, 'roles.editor.subjects', []),
});

const mapDispatchToProps = dispatch => ({
    onFetchRoleSuccess: role => dispatch(fetchRoleSuccess(role)),
    onCreateRoleSuccess: role => dispatch(createRole(role)),
    onUpdateRoleSuccess: role => dispatch(updateRole(role)),
    onFetchSubjectsSuccess: subjects => dispatch(fetchSubjectsSuccess(subjects)),
    resetRolesEditor: () => dispatch(resetRolesEditor()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
