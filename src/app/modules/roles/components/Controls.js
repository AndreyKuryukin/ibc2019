import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap'
import _ from 'lodash';

import styles from './styles.scss';
import ls from "i18n";
import Icon from "../../../components/Icon/Icon";

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        onRemove: PropTypes.func,
        checkedIds: PropTypes.array,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onCheckAll: () => null,
        onRemove: () => null,
    };

    onAdd = () => {
        this.context.history.push('/roles/add');
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(event.currentTarget.value)
    };

    render() {
        const { checkedIds } = this.props;
        return (
            <div className={styles.rolesControls}>
                <div className={styles.buttonGroup}>
                    <Icon icon={styles.addButton} onClick={this.onAdd}/>
                </div>
                <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                       className={styles.rolesSearch}
                       onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default RolesControls;
