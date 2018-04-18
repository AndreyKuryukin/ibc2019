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
import Sources from '../modules/sources/containers';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";
import _ from "lodash";


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
                exact: true,
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
            'POLICY': {
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
                path: "/kqi/:action?/:configId?/:projectionId?/:resultId?",
                component: KQI
            },
            'SOURCES': {
                path: "/sources",
                component: Sources
            }
        }
    };

    constructor(props) {
        super(props);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('200', this.refreshToken);
        const token = localStorage.getItem('jwtToken');
        rest.setCommonHeader('Authorization', token);
        rest.get('api/v1/user/current')
            .then((userResp) => {
                const user = userResp.data;
                this.props.onFetchUserSuccess(user)
            });
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

    getCommonRoutes = () => [
        {
            id: 'login-page',
            name: 'LOGIN',
            link: '/login'
        },
        {
            id: 'users-page',
            name: 'USERS',
            link: '/users'
        },
        {
            id: 'roles-page',
            name: 'ROLES',
            link: '/roles'
        },
    ];

    renderRoutes = (subjects = []) => {
        const subjectMap = this.getMapedSubjects() || {};
        const commonSubjects = this.getCommonRoutes();
        const totalSubjects = commonSubjects.concat(subjects);
        const subj = _.uniqBy(totalSubjects, sbj => sbj.name.toUpperCase());
        return subj.map(subject => <Route
            key={subject.id} {...subjectMap[subject.name.toUpperCase()]}/>);
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
