import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { selectSelectedUser, selectUserRoles } from '../selectors';
import RoleEditorComponent from '../components';
import rest from '../../../../../rest';
import { validateForm } from '../../../../../util/validation';
import {
    createUser,
    fetchDivisionsSuccess,
    fetchGroupsSuccess,
    fetchRolesSuccess,
    fetchUserSuccess,
    updateUser,
    resetUser,
} from '../actions';

import ls from 'i18n';

class UserEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
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
        onResetUser: () => null,
    };

    state = {
        errors: null,
    };

    componentDidMount() {
        this.validationConfig = {
            login: {
                required: !this.props.userId,
            },
            password: {
                required: !this.props.userId,
                passwordEqual: true
            },
            confirm: {
                required: !this.props.userId,
                passwordEqual: true
            },
        };
        this.context.pageBlur && this.context.pageBlur(true);
    }

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
        const customValidators = {
            passwordEqual: (value, testValue) => userData.password === userData.confirm
        };
        const customErrorMessages = {
            passwordEqual: ls('PASSWORD_NOT_EQUAL', 'Пароли не совпадают')
        };
        const errors = validateForm(userData, this.validationConfig, customErrorMessages, customValidators);
        if (_.isEmpty(errors)) {
            const submit = userId ? rest.put : rest.post;
            const success = (response) => {
                const callback = userId ? this.props.onUpdateUserSuccess : this.props.onCreateUserSuccess;
                const user = response.data;
                callback(user);
                this.context.history.push('/users');
            };

            submit('/api/v1/user', _.omit(userData, 'confirm'))
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
                onMount={this.onChildMount}
                onSubmit={this.onSubmit}
                onClose={this.props.onResetUser}
                errors={this.state.errors}
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
    onResetUser: () => dispatch(resetUser()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserEditor);