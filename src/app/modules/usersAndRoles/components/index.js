import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import TabPanel from '../../../components/TabPanel';
import Users from '../../users/container';
import Roles from '../../roles/containers';

import styles from './styles.scss';

class UsersAndRoles extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    render() {
        const { match, history } = this.props;
        const { params } = match;

        return (
            <TabPanel
                onTabClick={(tabId) => history && history.push(`/users-and-roles${tabId}`)}
                activeTabId={`/${params.page}`}
                className={styles.usersAndRolesContainer}
            >
                <Users
                    id="/users"
                    tabtitle={ls('USERS_TAB_TITLE', 'Пользователи')}
                    history={this.props.history}
                    match={this.props.match}
                />
                <Roles
                    id="/roles"
                    tabtitle={ls('ROLES_TAB_TITLE', 'Роли')}
                    history={this.props.history}
                    match={this.props.match}
                />
            </TabPanel>
        );
    }
}

export default UsersAndRoles;
