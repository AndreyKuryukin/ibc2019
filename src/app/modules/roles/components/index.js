import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import TabPanel from '../../../components/TabPanel';

import styles from './styles.scss';
import RoleEditor from '../modules/RoleEditor/containers';
import RolesTable from './Table';
import RolesControls from './Controls';
import ls from "i18n";

class Roles extends React.Component {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        rolesData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        rolesData: [],
        isLoading: false,
        onMount: () => null,
        onRemove: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            isAllChecked: false,
            checkedIds: [],
        };
    }

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onCheck = (checkedIds) => {
        this.setState({ checkedIds });
    };

    onRemove = () => {
        this.props.onRemove(this.state.checkedIds);
    };

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    render() {
        const {
            searchText,
            checkedIds
        } = this.state;

        const { match, rolesData, history, isLoading } = this.props;
        const { params } = match;
        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const roleId = params.id ? params.id : null;
        return (
            <TabPanel onTabClick={(tabId) => history && history.push(`${tabId}`)}
                      activeTabId="/roles"
                      className={styles.rolesContainer}
            >
                <div id="/users"
                     tabTitle={ls('USERS_TAB_TITLE', 'Пользователи')}
                />
                <div id="/roles"
                     tabTitle={ls('ROLES_TAB_TITLE', 'Роли')}
                     className={styles.rolesWrapper}>
                    <RolesControls
                        checkedIds={checkedIds}
                        searchText={searchText}
                        onSearchTextChange={this.onSearchTextChange}
                        onRemove={this.onRemove}
                    />
                    <RolesTable
                        searchText={searchText}
                        preloader={isLoading}
                        data={rolesData}
                        onCheck={this.onCheck}
                    />
                    {isEditorActive && <RoleEditor
                        active={isEditorActive}
                        roleId={roleId}
                    />}
                </div>
            </TabPanel>
        );
    }
}

export default Roles;
