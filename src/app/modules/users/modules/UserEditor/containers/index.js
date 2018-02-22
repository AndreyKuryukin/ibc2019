import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSelectedUser, selectUserRoles } from '../selectors';
import RoleEditorComponent from '../components';
import rest from '../../../../../rest';
import { fetchUserSuccess, fetchRolesSuccess, createUser, updateUser } from '../actions';

class UserEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        userId: PropTypes.number,
    }

    static defaultProps = {
        userId: null,
        onFetchUserSuccess: () => null,
        onFetchRolesSuccess: () => null,
        onUpdateUserSuccess: () => null,
        onCreateUserSuccess: () => null,
    };

    onChildMount = () => {
        const queries = [rest.get('/api/v1/role/user/:login', { urlParams: { login: 'username' }})];
        if (this.props.userId) {
            queries.push(rest.get('/api/v1/user/:id', { urlParams: { id: this.props.userId }}));
        }

        Promise.all(queries)
            .then(([rolesResponse, userResponse]) => {
                const roles = rolesResponse.data;
                const user = userResponse ? userResponse.data : null;

                this.props.onFetchRolesSuccess(roles);
                if (user) {
                    this.props.onFetchUserSuccess(user);
                }
            });
    }

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
});

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchUserSuccess(user)),
    onFetchRolesSuccess: roles => dispatch(fetchRolesSuccess(roles)),
    onUpdateUserSuccess: role => dispatch(updateUser(role)),
    onCreateUserSuccess: role => dispatch(createUser(role)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserEditor);