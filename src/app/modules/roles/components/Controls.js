import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

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
        checkedIds: []
    };

    onAdd = () => {
        this.context.history.push('/roles/add');
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(event.currentTarget.value)
    };

    render() {
        return (
            <div className={styles.rolesControls}>
                <div className={styles.buttonGroup}>
                    <Icon icon="addIcon" onClick={this.onAdd} />
                    <Icon icon="deleteIcon" onClick={this.props.onRemove} />
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
