import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ls, { getLanguageMap, setLanguageMap } from 'i18n';
import _ from "lodash";
import momentTz from 'moment-timezone';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { resetActiveUserSuccess } from '../actions';
import Page from '../modules/page/containers';
import Preloader from '../components/Preloader';
import Login from '../modules/login/containers';
import Dashboard from '../modules/dashboard/containers';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import Sources from '../modules/sources/containers';
import Alerts from '../modules/alerts/containers';
import Subscribers from '../modules/subscribers/containers';
import UsersAndRoles from '../modules/usersAndRoles/components';
import AlertsNotifications from '../modules/notifications/containers';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE, LANGUAGES } from "../costants/login";
import { setGlobalTimezone } from '../util/date';
import Subscriber from "../modules/subscriber/containers/index";

const LANGUAGE_SHORTHANDS = {
    RUSSIAN: 'ru',
    ENGLISH: 'en'
};

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

let isLanguageMapLoading = false;

const DASHBOARD_LANDING = '/dashboard/map/DAY/9/KAB';

class App extends React.Component {

    static propTypes = {
        onFetchUserSuccess: PropTypes.func,
        onLogOut: PropTypes.func,
        language: PropTypes.string,
    };

    static defaultProps = {
        onFetchUserSuccess: () => null,
        onLogOut: () => null,
        language: LANGUAGES.RUSSIAN,
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
                id: 'LOGIN',
                defaultTitle: 'Выход',
                link: '/login',
                path: '/login',
                exact: true,
                component: Login
            },
            'LANDING': {
                id: 'DASHBOARD',
                defaultTitle: 'Рабочий стол',
                link: DASHBOARD_LANDING,
                path: '/dashboard/:mode?/:regularity?/:mrfId?/:type?',
                component: Dashboard,
                exact: true
            },
            'KQI': {
                id: 'KQI',
                defaultTitle: 'KPI/KQI',
                link: '/kqi',
                path: "/kqi/:action?/:configId?/:projectionId?/:resultId?",
                component: KQI
            },
            'POLICY': {
                id: 'POLICIES',
                defaultTitle: 'Политики',
                link: '/policies',
                path: "/policies/:action?/:id?",
                component: Policies
            },
            //todo: rename to ALERTS
            'ALARMS': {
                id: 'ALARMS',
                defaultTitle: 'Аварии',
                link: '/alerts/ci',
                path: "/alerts/:type/:id?",
                component: Alerts
            },
            'REPORTS': {
                id: 'REPORTS',
                defaultTitle: 'Отчётность',
                link: '/reports',
                path: '/reports/:action?',
                component: Reports
            },
            'SOURCES': {
                id: 'SOURCES',
                defaultTitle: 'Источники',
                link: '/sources',
                path: "/sources",
                component: Sources
            },
            'USERS': {
                id: 'USERS',
                defaultTitle: 'Работа с пользователями',
                link: '/users-and-roles/users',
                path: "/users-and-roles/:page/:action?/:id?",
                component: UsersAndRoles
            },
            'ROLES': {
                id: 'ROLES',
                defaultTitle: 'Работа с пользователями',
                link: '/roles',
                path: "/roles/:action?/:id?",
                component: UsersAndRoles
            },
            'STB_LOADING': {
                id: 'STB_LOADING',
                defaultTitle: 'Время загрузки STB',
                link: '/stb-loading',
                path: "/stb-loading",
                component: StbLoading
            },
            'SUBSCRIBER': {
                id: 'SUBSCRIBER',
                defaultTitle: 'Абонент',
                link: '/subscriber',
                path: "/subscriber",
                component: Subscriber
            },
            'SUBSCRIBERS': {
                id: 'SUBSCRIBERS',
                defaultTitle: 'Subscriber card',
                link: '/subscribers',
                path: '/subscribers/:subscriberId?/:page?/:id?',
                component: Subscribers,
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
        rest.onResponseCode('200', this.refreshGlobalSettings);

        this.setToken();

        this.state = {
            loading: true,
            loggedIn: false,
            languageLoaded: false,
        };
    }

    onLogOut = () => {
        this.dropToken();
        this.props.history.push('/login');

        this.setState({
            loading: false,
            loggedIn: false
        }, () => this.onFetchUserSuccess({}));
    };

    setLocale = (locale) => {
        moment.locale(locale);
        momentLocalizer();
    };

    setToken = (token) => {
        const localToken = localStorage.getItem('jwtToken');

        if ((token || localToken) && token !== localToken) {
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


    extractHashParams = (hash = '') => hash.replace('#', '').split('&');

    extractHashToken = params => {
        const tokenParam = _.find(params, param => param.includes('token'));
        if (tokenParam) {
            return decodeURIComponent(tokenParam.split('=')[1]);
        }
        return false
    };

    isEmbedded = (params) => _.findIndex(params, param => param === 'embedded') !== -1;

    componentDidMount() {
        const hashParams = this.extractHashParams(_.get(this.props, 'location.hash'));
        const hashToken = this.extractHashToken(hashParams);
        const embedded = !!hashToken;
        const localToken = hashToken || localStorage.getItem('jwtToken');
        this.setToken(localToken);
        this.setState({ loading: true, embedded });
        rest.get('api/v1/user/current')
            .then((userResp) => {
                const user = userResp.data || {};
                if (user.time_zone) {
                    setGlobalTimezone(user.time_zone);
                } else {
                    setGlobalTimezone(momentTz.tz.guess());
                }
                this.setState({ loading: this.state.loading || false, loggedIn: true }, () => this.onFetchUserSuccess(user));
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
                } else if (e && e.status === 403 && localToken) {
                    this.context.notifications.notify({
                        title: ls('LOGIN_ERROR_FIELD', 'Ошибка авторизации:'),
                        message: ls('LOGIN_ERROR_FIELD', 'Войдите в систему'),
                        type: 'CRITICAL',
                        code: 'login-failed'
                    });
                }
                this.setState({ loading: this.state.loading || false, loggedIn: false }, () => this.onFetchUserSuccess({}));
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

    fetchUserSuccess = (user) => this.setState({ loggedIn: true }, () => this.onFetchUserSuccess(user));

    onFetchUserSuccess = (user) => {
        const embedded = this.state.embedded;

        const subjectMap = this.getMapedSubjects() || {};
        const commonSubjects = this.getCommonSubjects();
        const userSubjects = embedded ? this.getEmbdedWhiteList() : this.mapUserSubjects(user);
        const totalSubjects = userSubjects.concat(commonSubjects);
        const menuOrder = Object.keys(subjectMap);
        user.subjects = _.uniqBy(totalSubjects, sbj => sbj.name.toUpperCase());
        user.menu = user.subjects
            .filter(subject => subject.name !== 'LOGIN' && subject.name.toUpperCase() !== 'ROLES')
            .sort((subjA, subjB) => this.menuSorter(subjA.name.toUpperCase(), subjB.name.toUpperCase(), menuOrder))
            .map(subject => ({
                id: subjectMap[subject.name.toUpperCase()].id,
                defaultTitle: subjectMap[subject.name.toUpperCase()].defaultTitle,
                link: subjectMap[subject.name.toUpperCase()].link,
            }));
        this.props.onFetchUserSuccess(user);
    };

    refreshGlobalSettings = (response) => {
        const languageMap = getLanguageMap();
        const isLoginRequest = _.get(response, 'request.responseURL', '').indexOf('/login') !== -1
        const token = isLoginRequest
            ? response.headers[LOGIN_SUCCESS_RESPONSE.AUTH]
            : localStorage.getItem('jwtToken');

        this.setToken(token);

        if (_.isEmpty(languageMap) && (isLoginRequest || !isLanguageMapLoading)) {
            isLanguageMapLoading = true;
            this.setState({ loading: true });
            rest.get('api/v1/user/language/current')
                .then(response => {
                    const locale = LANGUAGE_SHORTHANDS[response.data];

                    this.setLocale(locale);

                    return rest.get(`${locale}.json`);
                })
                .then(response => {
                    const map = response.data;
                    setLanguageMap(map);

                    isLanguageMapLoading = false;
                    this.setState({ loading: false });
                })
                .catch((e) => {
                    console.error(e);

                    this.setState({ loading: false });
                });
        }
    };


    saveState = () => {
        //todo: Сделать сохранение стейта, при протухании токена
    };

    navigateLogin = () => {
        this.saveState();
        this.onLogOut();
    };

    getEmbdedWhiteList = () => [
        {
            name: 'SUBSCRIBER',
            access_level: ['EDIT', 'VIEW']
        },
    ];

    getCommonSubjects = () => [
        {
            name: 'LOGIN',
            access_level: ['EDIT', 'VIEW']
        },
        {
            name: 'LANDING',
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
        const { language, user = {} } = this.props;
        const { subjects } = user;
        const { loading, loggedIn, embedded } = this.state;
        const routes = this.renderRoutes(subjects);
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Preloader
                    active={this.state.loading}
                    text={ls('PRELOADER_DEFAULT_TEXT', language === LANGUAGES.RUSSIAN ? 'Загрузка' : 'Loading')}
                >
                    {!loading && <Page onLogOut={this.onLogOut}
                                              embedded={embedded}
                    >
                        <Switch>
                            <Redirect from="/" exact to={DASHBOARD_LANDING}/>
                            <Redirect from="/dashboard" exact to={DASHBOARD_LANDING}/>
                            {routes}
                            {loggedIn ? <Route component={NoMatch}/> : this.loginRedirect()}
                        </Switch>
                    </Page>}
                </Preloader>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
    onLogOut: () => dispatch(resetActiveUserSuccess()),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));
