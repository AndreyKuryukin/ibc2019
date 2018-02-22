import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import RoleEditor from '../modules/RoleEditor/containers';
import RolesTable from './Table';
import RolesControls from './Controls';

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

    onCheck = (checkedIds) => {
        this.setState({ checkedIds });
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


    render() {
        const {
            searchText,
            checkedIds,
        } = this.state;
        const { match, rolesData, isLoading } = this.props;
        const { params } = match;
        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const roleId = params.id ? Number(params.id) : null;
        return (
            <div className={styles.rolesWrapper}>
                <RolesControls
                    checkedIds={checkedIds}
                    searchText={searchText}
                    onSearchTextChange={this.onSearchTextChange}
                    onDelete={this.onDeleteRoles}
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
        );
    }
}

export default Roles;
