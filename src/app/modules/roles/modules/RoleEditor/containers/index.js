import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import RoleEditorComponent from '../components';
import { selectSelectedRole, selectSourceOptions, selectSubjects, selectSubjectsByRole } from '../selectors';
import { createRole, updateRole } from '../../../actions';
import { fetchRoleSuccess, fetchSubjectsSuccess } from '../actions';
import rest from '../../../../../rest';

class RoleEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        roleId: PropTypes.number,
        onUpdateRoleSuccess: PropTypes.func,
        onCreateRoleSuccess: PropTypes.func,
        onFetchRoleSuccess: PropTypes.func,
    };

    static defaultProps = {
        roleId: null,
        onUpdateRoleSuccess: () => null,
        onCreateRoleSuccess: () => null,
        onFetchRoleSuccess: () => null,
    };

    componentDidMount() {
        if (this.props.roleId) {
            const urlParams = {
                roleId: this.props.roleId,
            };
            this.setState({ isLoading: true });
            Promise.all([rest.get('/api/v1/role/:roleId', { urlParams }), rest.get('/api/v1/subject')])
                .then(([roleResponse, subjectResponse]) => {
                    const role = roleResponse.data;
                    const subjects = subjectResponse.data;
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
                    this.props.onFetchSubjectsSuccess(response.data);
                })
        }
        this.context.pageBlur && this.context.pageBlur(true);
    }

    onSubmit = (roleId, roleData) => {
        const submit = roleId ? rest.put : rest.post;
        const success = (response) => {
            const callback = roleId ? this.props.onUpdateRoleSuccess : this.props.onCreateRoleSuccess;
            const role = response.data;
            callback(role);
            this.context.history.push('/roles');
        };

        submit('/api/v1/role', roleData)
            .then(success);
    };

    render() {
        return (
            <RoleEditorComponent
                onSubmit={this.onSubmit}
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
});

const mapDispatchToProps = dispatch => ({
    onFetchRoleSuccess: role => dispatch(fetchRoleSuccess(role)),
    onCreateRoleSuccess: role => dispatch(createRole(role)),
    onUpdateRoleSuccess: role => dispatch(updateRole(role)),
    onFetchSubjectsSuccess: subjects => dispatch(fetchSubjectsSuccess(subjects)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
