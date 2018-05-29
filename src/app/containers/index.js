import React from 'react';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Login from '../modules/login/containers';
import Dasboard from '../modules/dashboard/containers';
import Users from '../modules/users/container';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import Sources from '../modules/sources/containers';
import Alarms from '../modules/alarms/containers';
import UsersAndRoles from '../modules/usersAndRoles/components';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";
import { setGlobalTimezone } from '../util/date';
import _ from "lodash";
import momentTz from 'moment-timezone';
import Roles from "../modules/roles/containers/index";

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
            'LOGIN': {
                title: 'Выход',
                link: '/login',
                path: '/login',
                exact: true,
                component: Login
            },
            'LANDING': {
                title: 'Рабочий стол',
                path: '/landing',
                link: '/landing',
                component: Dasboard,
                exact: true
            },
            'KQI': {
                title: 'KPI/KQI',
                link: '/kqi',
                path: "/kqi/:action?/:configId?/:projectionId?/:resultId?",
                component: KQI
            },
            'POLICY': {
                title: 'Политики',
                link: '/policies',
                path: "/policies/:action?/:id?",
                component: Policies
            },
            'ALARMS': {
                title: 'Аварии',
                link: '/alarms/group-policies/current',
                path: "/alarms/:subject/:state/:id?",
                component: Alarms
            },
            'REPORTS': {
                title: 'Отчётность',
                link: '/reports',
                path: '/reports/:action?',
                component: Reports
            },
            'SOURCES': {
                title: 'Источники',
                link: '/sources',
                path: "/sources",
                component: Sources
            },
            'USERS': {
                title: 'Работа с пользователями',
                link: '/users-and-roles/users',
                path: "/users-and-roles/:page/:action?/:id?",
                component: UsersAndRoles
            },
            'ROLES': {
                title: 'Работа с пользователями',
                link: '/roles',
                path: "/roles/:action?/:id?",
                component: UsersAndRoles
            },
            'STB_LOADING': {
                title: 'Время загрузки STB',
                link: '/stb-loading',
                path: "/stb-loading",
                component: StbLoading
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

    menuSorter = (subjA, subjB, menuOrder) => {
        return menuOrder.findIndex(item => item === subjA) - menuOrder.findIndex(item => item === subjB);
    };

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
        const menuOrder = Object.keys(subjectMap);
        user.subjects = _.uniqBy(totalSubjects, sbj => sbj.name.toUpperCase());
        user.menu = user.subjects
            .filter(subject => subject.name !== 'LOGIN' && subject.name.toUpperCase() !== 'ROLES')
            .sort((subjA, subjB) => this.menuSorter(subjA.name.toUpperCase(), subjB.name.toUpperCase(), menuOrder))
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
            link: '/users-and-roles/users'
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
        {
            id: 'landing-page',
            name: 'LANDING',
            link: '/landing'
        },
        {
            id: 'sources-page',
            name: 'SOURCES',
            link: '/sources'
        },
    ];

    renderRoutes = (subjects = []) => {
        const subjectMap = this.getMapedSubjects() || {};

        return subjects.map(subject => {
            const config = subjectMap[subject.name.toUpperCase()];
            return config ? <Route
                key={subject.name} {...config}/> : null
        });
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
