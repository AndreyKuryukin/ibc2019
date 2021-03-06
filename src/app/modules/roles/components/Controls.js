import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import styles from './styles.scss';
import ls from "i18n";
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input";
import Dropdown from "../../../components/Dropdown";

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        onRemove: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onCheckAll: () => null,
        onRemove: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            removeConfirmOpen: false,
        };
    }

    onAdd = () => {
        this.context.history.push('/users-and-roles/roles/add');
    };

    onSearchTextChange = (searchText) => {
        this.props.onSearchTextChange(searchText);
    };

    triggerDelete = () => {
        this.setState({ removeConfirmOpen: !this.state.removeConfirmOpen });
    };

    onRemove = () => {
        this.props.onRemove();
        this.triggerDelete();
    };

    render() {
        return (
            <div className={styles.rolesControls}>
                {this.context.hasAccess('ROLES', 'EDIT') && <div className={styles.buttonGroup}>
                    <Icon
                        itemId="roles_add"
                        icon="addIcon"
                        onClick={this.onAdd}
                        title={ls('ADD_ROLE_TITLE', 'Добавить роль')}
                    />
                    <Dropdown
                        isOpen={this.state.removeConfirmOpen}
                        dropdownClass={styles.rolesRemovingDropdown}
                        onToggle={this.triggerDelete}
                        trigger={
                            <Icon
                                itemId="roles_delete"
                                icon={this.state.removeConfirmOpen ? 'deleteIconHover' : 'deleteIcon'}
                                onClick={this.triggerDelete}
                                title={ls('DELETE_ROLE_TITLE', 'Удалить роль')}
                            />
                        }
                    >
                        <div className={styles.confirmationMsg}>
                            {ls('ROLES_REMOVE_CONFIRM_TITLE', 'Подтвердите действие:')}
                            <br/>
                            {ls('ROLES_REMOVE_CONFIRM_MESSAGE', 'Удаление роли')}
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button itemId="roles_delete_cancel" outline color="action" onClick={this.triggerDelete}>
                                {ls('CANCEL', 'Отмена')}
                            </Button>
                            <Button itemId="roles_delete_confirm" color="action" onClick={this.onRemove}>
                                {ls('REMOVE', 'Удалить')}
                            </Button>
                        </div>
                    </Dropdown>
                </div>}
                <Input
                    itemId="roles_search_field"
                    placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                    className={styles.rolesSearch}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default RolesControls;
