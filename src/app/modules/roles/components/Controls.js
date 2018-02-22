import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap'
import _ from 'lodash';

import styles from './styles.scss';
import ls from "i18n";

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        onDelete: PropTypes.func,
        checkedIds: PropTypes.array,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onCheckAll: () => null,
        onDelete: () => null,
    };

    onAdd = () => {
        this.context.history.push('/roles/add');
    };

    onSerchTextChange = (event) => {
        this.props.onSearchTextChange(event.currentTarget.value)
    };

    onRemove = () => {

    }

    render() {
        const { checkedIds } = this.props;
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
                        color="link"
                        disabled={_.isEmpty(checkedIds)}
                        onClick={this.onRemove()}>
                        {ls('ROLES_PEMOVE_TITLE', 'Удалить')}
                    </Button>
                </div>
                <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                       className={styles.search}
                       onChange={this.onSerchTextChange}
                />
            </div>
        );
    }
}

export default RolesControls;
