import React from 'react';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Login from '../modules/login/containers';
import Roles from '../modules/roles/containers';
import Users from '../modules/users/container';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import Sources from '../modules/sources/containers';
import Alarms from '../modules/alarms/containers';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";
import { setGlobalTimezone } from '../util/date';
import _ from "lodash";
import momentTz from 'moment-timezone';

const noMatchStyle = {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 22,
};

const NoMatch = () => (
    <div style={noMatchStyle}>{ls('PAGE_NOT_FOUND', 'Страница не найдена')}</div>
);

class App extends React.Component {

    getMapedSubjects = () => {
        return {
            'LANDING': {
                path: '/',
                component: Login,
                exact: true
            },
            'LOGIN': {
                title: 'Выход',
                link: '/login',
                path: '/login',
                exact: true,
                component: Login
            },
            'USERS': {
                title: 'Пользователи',
                link: '/users',
                path: "/users/:action?/:id?",
                component: Users
            },
            'ROLES': {
                title: 'Роли',
                link: '/roles',
                path: "/roles/:action?/:id?",
                component: Roles
            },
            'POLICY': {
                title: 'Политики',
                link: '/policies',
                path: "/policies/:action?/:id?",
                component: Policies
            },
            'REPORTS': {
                title: 'Отчёты',
                link: '/reports',
                path: '/reports/:action?',
                component: Reports
            },
            'STB_LOADING': {
                title: 'Время загрузки STB',
                link: '/stb-loading',
                path: "/stb-loading",
                component: StbLoading
            },
            'KQI': {
                title: 'KQI',
                link: '/kqi',
                path: "/kqi/:action?/:configId?/:projectionId?/:resultId?",
                component: KQI
            },
            'SOURCES': {
                title: 'Источники',
                link: '/sources',
                path: "/sources",
                component: Sources
            },
            'ALARMS': {
                title: 'Отчёт по авариям',
                link: '/alarms/group-policies/current',
                path: "/alarms/:subject/:state/:id?",
                component: Alarms
            }
        }
    };

    static childContextTypes = {
        fetchUserSuccess: PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        fetchUserSuccess: this.onFetchUserSuccess,
    });

    constructor(props) {
        super(props);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('200', this.refreshToken);
        const token = localStorage.getItem('jwtToken');
        rest.setCommonHeader('Authorization', token);

        this.state = { token };
    }

    componentDidMount() {
        rest.get('api/v1/user/current')
            .then((userResp) => {
                const user = userResp.data || {};
                this.onFetchUserSuccess(user);
                if (user.time_zone) {
                    setGlobalTimezone(user.time_zone);
                } else {
                    setGlobalTimezone(momentTz.tz.guess());
                }
            })
            .catch(() => {
                this.props.onFetchUserSuccess({
                    subjects: this.getCommonRoutes(),
                });
            });
    }

    onFetchUserSuccess = (user) => {
        const subjectMap = this.getMapedSubjects() || {};
        const commonSubjects = this.getCommonRoutes();
        const totalSubjects = user.subjects.concat(commonSubjects);
        user.subjects = _.uniqBy(totalSubjects, sbj => sbj.name.toUpperCase());
        user.menu = user.subjects
            .filter(subject => subject.name !== 'LOGIN')
            .map(subject => ({
                title: subjectMap[subject.name.toUpperCase()].title,
                link: subjectMap[subject.name.toUpperCase()].link,
            }));
        this.props.onFetchUserSuccess(user);
    };

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
            id: 'users-page',
            name: 'USERS',
            link: '/users'
        },
        {
            id: 'roles-page',
            name: 'ROLES',
            link: '/roles'
        },
        {
            id: 'reports-page',
            name: 'REPORTS',
            link: '/reports'
        },
        {
            id: 'alarms',
            name: 'ALARMS',
            link: '/alarms/group-policies/current'
        },
        {
            id: 'login-page',
            name: 'LOGIN',
            link: '/login'
        },
    ];

    renderRoutes = (subjects = []) => {
        const subjectMap = this.getMapedSubjects() || {};

        return subjects.map(subject => <Route
            key={subject.name} {...subjectMap[subject.name.toUpperCase()]}/>);
    };

    render() {
        const { user = {} } = this.props;
        const { subjects } = user;
        const routes = this.renderRoutes(subjects);

        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Switch>
                    {routes}
                    <Route component={NoMatch}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));
