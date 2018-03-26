import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { selectSelectedUser, selectUserRoles } from '../selectors';
import RoleEditorComponent from '../components';
import rest from '../../../../../rest';
import {
    createUser,
    fetchDivisionsSuccess,
    fetchGroupsSuccess,
    fetchRolesSuccess,
    fetchUserSuccess,
    updateUser
} from '../actions';

class UserEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        userId: PropTypes.string,
    };

    static defaultProps = {
        userId: null,
        onFetchUserSuccess: () => null,
        onFetchRolesSuccess: () => null,
        onFetchDivisionsSuccess: () => null,
        onFetchGroupsSuccess: () => null,
        onUpdateUserSuccess: () => null,
        onCreateUserSuccess: () => null,
    };

    onChildMount = () => {
        const queries = [rest.get('/api/v1/role'), rest.get('/api/v1/group')];
        if (this.props.userId) {
            queries.push(rest.get('/api/v1/user/:id', { urlParams: { id: this.props.userId } }));
        }

        Promise.all(queries)
            .then(([rolesResponse, groupsResponse, userResponse]) => {
                const roles = rolesResponse.data;
                const groups = groupsResponse.data;
                if (userResponse) {
                    this.props.onFetchUserSuccess(userResponse.data);
                }
                this.props.onFetchRolesSuccess(roles);
                this.props.onFetchGroupsSuccess(groups);

            });
    };

    onSubmit = (userId, userData) => {
        const submit = userId ? rest.put : rest.post;
        const success = (response) => {
            const callback = userId ? this.props.onUpdateUserSuccess : this.props.onCreateUserSuccess;
            const user = response.data;
            callback(user);
            this.context.history.push('/users');
        };

        submit('/api/v1/user', userData)
            .then(success);
    };

    render() {
        return (
            <RoleEditorComponent
                onMount={this.onChildMount}
                onSubmit={this.onSubmit}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
    user: selectSelectedUser(state),
    rolesList: selectUserRoles(state),
    groupsList: state.users.editor.groups,
    divisions: state.users.users.divisions,
});

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchUserSuccess(user)),
    onFetchRolesSuccess: roles => dispatch(fetchRolesSuccess(roles)),
    onFetchGroupsSuccess: groups => dispatch(fetchGroupsSuccess(groups)),
    onUpdateUserSuccess: role => dispatch(updateUser(role)),
    onCreateUserSuccess: role => dispatch(createUser(role)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserEditor);