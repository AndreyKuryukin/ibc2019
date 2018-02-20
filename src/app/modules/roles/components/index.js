import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'qreact';
import styles from './styles.scss';
import RoleEditor from '../modules/RoleEditor/containers';
import RolesTable from './RolesGrid/RolesTable';
import RolesControls from './RolesGrid/RolesControls';

class Roles extends React.Component {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        rolesData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
        onDeleteRoles: PropTypes.func,
    };

    static defaultProps = {
        rolesData: [],
        isLoading: false,
        onMount: () => null,
        onDeleteRoles: () => null,
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

    onCheck = (isAllChecked, checkedIds) => {
        const checkedInfo = { isAllChecked };
        if (Array.isArray(checkedIds)) {
            checkedInfo.checkedIds = checkedIds;
        }

        this.setState({ ...checkedInfo });
    }

    onDeleteRoles = () => {
        if (typeof this.props.onDeleteRoles === 'function') {
            this.props.onDeleteRoles(this.state.checkedIds);
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    }

    onTableDataChange = ({ checked, isAllChecked }) => {
        const checkedIds = checked.map(row => row.id);
        this.onCheck(isAllChecked, checkedIds);
    }

    render() {
        const {
            searchText,
            isAllChecked,
            checkedIds,
        } = this.state;
        const { match, rolesData, isLoading } = this.props;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const roleId = params.id ? Number(params.id) : null;

        return (
            <div className={styles.rolesWrapper}>
                <Panel
                    title="Роли"
                    noScroll
                    vertical
                >
                    <RolesControls
                        isAllChecked={isAllChecked}
                        searchText={searchText}
                        onSearchTextChange={this.onSearchTextChange}
                        onCheckAll={this.onCheck}
                        onDelete={this.onDeleteRoles}
                    />
                    <RolesTable
                        searchText={searchText}
                        isAllChecked={isAllChecked}
                        preloader={isLoading}
                        checked={checkedIds}
                        onTableDataChange={this.onTableDataChange}
                        data={rolesData}
                    />
                </Panel>
                {isEditorActive && <RoleEditor
                    active={isEditorActive}
                    roleId={roleId}
                />}
            </div>
        );
    }
}

export default Roles;
