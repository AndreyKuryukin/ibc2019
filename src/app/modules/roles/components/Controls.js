import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

import styles from './styles.scss';
import ls from "i18n";
import Icon from "../../../components/Icon/Icon";
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
        this.state = {}
    }

    onAdd = () => {
        this.context.history.push('/users-and-roles/roles/add');
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(event.currentTarget.value)
    };

    triggerDelete = () => {
        this.setState({ removeConfirmOpen: !this.state.removeConfirmOpen })
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
                            <Button outline color="action" onClick={this.triggerDelete}>
                                {ls('CANCEL', 'Отмена')}
                            </Button>
                            <Button color="action" onClick={this.onRemove}>
                                {ls('REMOVE', 'Удалить')}
                            </Button>
                        </div>
                    </Dropdown>
                </div>}
                <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                       className={styles.rolesSearch}
                       onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default RolesControls;
