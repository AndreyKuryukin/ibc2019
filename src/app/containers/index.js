import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from "lodash";
import momentTz from 'moment-timezone';

import { resetActiveUserSuccess } from '../actions';
import PageWrapper from '../components/PageWrapper';
import Preloader from '../components/Preloader';
import Login from '../modules/login/containers';
import Dashboard from '../modules/dashboard/containers';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import Sources from '../modules/sources/containers';
import Alarms from '../modules/alarms/containers';
import UsersAndRoles from '../modules/usersAndRoles/components';
import AlarmsNotifications from '../modules/notifications/containers';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";
import { setGlobalTimezone } from '../util/date';


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

    static propTypes = {
        onFetchUserSuccess: PropTypes.func,
        onLogOut: PropTypes.func,
    };

    static defaultProps = {
        onFetchUserSuccess: () => null,
        onLogOut: () => null,
    };

    static contextTypes = {
        notifications: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        fetchUserSuccess: PropTypes.func.isRequired,
        hasAccess: PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        fetchUserSuccess: this.fetchUserSuccess,
        hasAccess: this.hasAccess,
    });

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
                link: '/dashboard',
                path: '/dashboard/:mode?/:regularity?/:mrfId?/:type?',
                component: Dashboard,
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
                link: '/alarms/ci',
                path: "/alarms/:type/:id?",
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

    hasAccess = (subjectName, level) => {
        const userSubjects = _.get(this.props, 'user.subjects', []);
        const subject = _.find(userSubjects, (sbj) => sbj.name.toUpperCase() === subjectName.toUpperCase());
        const accessLevel = _.get(subject, 'access_level', []);
        return !!_.find(accessLevel, lvl => lvl.toUpperCase() === level.toUpperCase())
    };

    constructor(props) {
        super(props);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('403', this.navigateLogin); //todo: Должен быть 401
        rest.onResponseCode('200', this.refreshToken);
        this.setToken();
        this.state = { loading: true, loggedIn: false };
    }

    onLogOut = () => {
        this.dropToken();
        this.props.history.push('/login');
        this.setState({ loggedIn: false }, () => this.onFetchUserSuccess({}))
    };

    setToken = (token) => {
        const localToken = localStorage.getItem('jwtToken');
        if (token !== localToken) {
            localStorage.setItem('jwtToken', token || localToken);
            rest.setCommonHeader('Authorization', token || localToken);
        }
    };

    dropToken = () => {
        localStorage.removeItem('jwtToken');
        rest.setCommonHeader('Authorization', null);
    };

    menuSorter = (subjA, subjB, menuOrder) => {
        return menuOrder.findIndex(item => item === subjA) - menuOrder.findIndex(item => item === subjB);
    };

    componentDidMount() {
        this.setState({ loading: true });
        rest.get('api/v1/user/current')
            .then((userResp) => {
                const user = userResp.data || {};
                if (user.time_zone) {
                    setGlobalTimezone(user.time_zone);
                } else {
                    setGlobalTimezone(momentTz.tz.guess());
                }
                this.setState({ loading: false, loggedIn: true }, () => this.onFetchUserSuccess(user));
            })
            .catch((e) => {
                this.navigateLogin();
                if (e && e.status === 500) {
                    this.context.notifications.notify({
                        title: ls('LOGIN_ERROR_FIELD', 'Ошибка авторизации:'),
                        message: ls('LOGIN_ERROR_FIELD', 'Внутренняя ошибка сервера'),
                        type: 'CRITICAL',
                        code: 'login-failed'
                    });
                } else if (e && e.status === 403) {
                    this.context.notifications.notify({
                        title: ls('LOGIN_ERROR_FIELD', 'Ошибка авторизации:'),
                        message: ls('LOGIN_ERROR_FIELD', 'Войдите в систему'),
                        type: 'CRITICAL',
                        code: 'login-failed'
                    });
                }
                this.setState({ loading: false, loggedIn: false }, () => this.onFetchUserSuccess({}));
            });
    }

    mapLevels = (level = '') => {
        switch (level.toUpperCase()) {
            case 'EDIT':
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

    mapUserSubjects = (user) => {
        const roles = _.get(user, 'roles', []);
        const rolesSubjects = _.reduce(roles, (subjects, role) => subjects.concat(this.mapRoleToSubjects(role)), []);
        const subjectMap = _.reduce(rolesSubjects, (subjects, subject) => {
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

    fetchUserSuccess = (user) => this.setState({loggedIn: true}, () => this.onFetchUserSuccess(user));

    onFetchUserSuccess = (user) => {
        const subjectMap = this.getMapedSubjects() || {};
        const commonSubjects = this.getCommonSubjects();
        const totalSubjects = this.mapUserSubjects(user).concat(commonSubjects);
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
        this.setToken(token);
    };

    saveState = () => {
        //todo: Сделать сохранение стейта, при протухании токена
    };

    navigateLogin = () => {
        this.saveState();
        this.onLogOut()
    };

    getCommonSubjects = () => [
        {
            name: 'LOGIN',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'LANDING',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'USERS',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'ROLES',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'REPORTS',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'ALARMS',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'POLICY',
            access_level: ['EDIT', 'VIEW']
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

    loginRedirect = () => <Route render={() => {
        this.props.history.push('/login');
        return null
    }}/>;

    render() {
        const { user = {} } = this.props;
        const { subjects } = user;
        const { loading, loggedIn } = this.state;
        const routes = this.renderRoutes(subjects);
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <AlarmsNotifications loggedIn={loggedIn}/>
                <Preloader active={this.state.loading}>
                    {!loading && <PageWrapper onLogOut={this.onLogOut}>
                        <Switch>
                            <Redirect from="/" exact to="/dashboard"/>
                            {routes}
                            {loggedIn ? <Route component={NoMatch}/> : this.loginRedirect()}
                        </Switch>
                    </PageWrapper>}
                </Preloader>
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
    onLogOut: () => dispatch(resetActiveUserSuccess()),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));
