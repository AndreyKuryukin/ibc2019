import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoleEditorComponent from '../components';
import { selectSelectedRole, selectSourceOptions, selectSubjectsByRole } from '../selectors';
import { updateRole, createRole } from '../../../actions';
import { fetchRoleSuccess } from '../actions';
import rest from '../../../../../rest';

class RoleEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

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

    onChildMount = () => {
        if (this.props.roleId) {
            const urlParams = {
                roleId: this.props.roleId,
            };
            rest.get('/api/v1/role/:roleId', { urlParams })
                .then((response) => {
                    const role = response.data;
                    this.props.onFetchRoleSuccess(role);
                });
        }
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
    }

    render() {
        return (
            <RoleEditorComponent
                onSubmit={this.onSubmit}
                onMount={this.onChildMount}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
    role: selectSelectedRole(state),
    sourceOptions: selectSourceOptions(state),
    subjectsByRole: selectSubjectsByRole(state),
});

const mapDispatchToProps = dispatch => ({
    onFetchRoleSuccess: role => dispatch(fetchRoleSuccess(role)),
    onCreateRoleSuccess: role => dispatch(createRole(role)),
    onUpdateRoleSuccess: role => dispatch(updateRole(role)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RoleEditor);
