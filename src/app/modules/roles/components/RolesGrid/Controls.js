import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap'

import styles from './styles.scss';
import ls from "i18n";

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        isAllChecked: PropTypes.bool,
        onDelete: PropTypes.func,
    };

    static defaultProps = {
        isAllChecked: false,
        onSearchTextChange: () => null,
        onCheckAll: () => null,
        onDelete: () => null,
    };

    onAdd = () => {
        this.context.history.push('/roles/add');
    };

    render() {
        const { isAllChecked, onDelete } = this.props;
        return (
            <div className={styles.controls}>
                <div className={styles.buttonGroup}>
                    <Button
                        color="primary"
                        onClick={this.onAdd}
                    >
                        {ls('ROLES_ADD_TITLE', 'Добавить')}
                    </Button>
                    <Button
                        color="link">
                        {ls('ROLES_PEMOVE_TITLE', 'Удалить')}
                    </Button>
                </div>
                <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')} className={styles.search}/>
            </div>
        );
    }
}

export default RolesControls;
