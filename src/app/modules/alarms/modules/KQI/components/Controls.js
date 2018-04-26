import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

import styles from './styles.scss';
import ls from "i18n";

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
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

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(event.currentTarget.value)
    };

    render() {
        return (
            <div className={styles.kqiHistoryControls}>
                <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                       className={styles.kqiHistorySearch}
                       onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default RolesControls;
