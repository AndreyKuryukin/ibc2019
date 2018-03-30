import React from 'react';
import { Route } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

import Login from '../modules/login/containers';
import Roles from '../modules/roles/containers';
import Users from '../modules/users/container';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";


class App extends React.Component {

    getMapedSubjects = () => {
        return {
            'LANDING': {
                path: '/',
                component: Login,
                exact: true
            },
            'LOGIN': {
                path: '/login',
                component: Login
            },
            'USERS': {
                path: "/users/:action?/:id?",
                component: Users
            },
            'ROLES': {
                path: "/roles/:action?/:id?",
                component: Roles
            },
            'POLICIES': {
                path: "/policies/:action?/:id?",
                component: Policies
            },
            'REPORTS': {
                path: '/reports/:action?',
                component: Reports
            },
            'STB_LOADING': {
                path: "/stb-loading",
                component: StbLoading
            },
            'KQI': {
                path: "/kqi/:action?",
                component: KQI
            }
        }
    };

    defaultUser = {
        userName: '',
        login: '',
        subjects: ['LANDING', 'LOGIN', 'USERS', 'ROLES', 'POLICIES', 'REPORTS', 'STB_LOADING', 'KQI'],
        menu: [
            {
                title: 'Роли',
                link: '/roles'
            },
            {
                title: 'Пользователи',
                link: '/users'
            },
            {
                title: 'Политики',
                link: '/policies'
            },
            {
                title: 'Отчёты',
                link: '/reports'
            },
            {
                title: 'KPI/KQI',
                link: '/kqi'
            },
            {
                title: 'Выход',
                link: '/login'
            }
        ]
    };

    constructor(props) {
        super(props);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('200', this.refreshToken);
        const token = localStorage.getItem('jwtToken');
        rest.setCommonHeader('Authorization', token);
        props.onFetchUserSuccess(this.defaultUser);
        // rest.get('api/v1/user')
        //     .then((userResp) => {
        //         const user = userResp.data;
        //         this.props.onFetchUserSuccess(user)
        //     })
        this.state = { token };
    }

    refreshToken = (response) => {
        const token = response.headers[LOGIN_SUCCESS_RESPONSE.AUTH];
        const localToken = localStorage.getItem('jwtToken');
        if (token && token !== localToken) {
            localStorage.setItem('jwtToken', token);
            rest.setCommonHeader('Authorization', token);
        }
    };

    navigateLogin = () => {
        const history = this.props.history;
        history && history.push('/login')
    };

    renderRoutes = (subjects = []) => {

        const subjectMap = this.getMapedSubjects() || {};
        return subjects.map(subject => <Route key={subject} {...subjectMap[subject]}/>)
    };

    render() {
        const { user = {} } = this.props;
        const { subjects } = user;
        const routes = this.renderRoutes(subjects);

        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                {routes}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
};

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));
