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
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
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

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onCheck = (checkedIds) => {
        this.setState({ checkedIds });
    };

    onRemove = () => {
        const onSuccess = () => {
            this.setState({ checkedIds: [] });
        };
        this.props.onRemove(this.state.checkedIds, onSuccess);
    };

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    render() {
        const {
            searchText,
            checkedIds,
        } = this.state;

        const { match, rolesData, isLoading } = this.props;
        const { params } = match;
        const isEditorActive = this.context.hasAccess('ROLES', 'EDIT') && (params.action === 'edit' || params.action === 'add');
        const roleId = params.id ? params.id : null;

        return (
            <div className={styles.rolesWrapper}>
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
                    checked={checkedIds}
                />
                {isEditorActive && <RoleEditor
                    active={isEditorActive}
                    roleId={roleId}
                />}
            </div>
        );
    }
}

export default Roles;
