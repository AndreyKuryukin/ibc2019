import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap'
import _ from 'lodash';

import styles from './styles.scss';
import ls from "i18n";

class PoliciesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
    };

    onAdd = () => {
        this.context.history.push('/policies/add');
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value'));
    };

    render() {
        return (
            <div className={styles.controls}>
                <div className={styles.buttonGroup}>
                    <Button
                        color="primary"
                        onClick={this.onAdd}
                    >
                        {ls('POLICIES_ADD_TITLE', 'Добавить')}
                    </Button>
                </div>
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default PoliciesControls;
