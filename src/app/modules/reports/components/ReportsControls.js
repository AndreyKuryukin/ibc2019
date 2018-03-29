import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap'
import ls from 'i18n';
import Icon from "../../../components/Icon/Icon";

import styles from './styles.scss';

class ReportsControls extends React.PureComponent {
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
        this.context.history.push('/reports/add');
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value'));
    };

    render() {
        return (
            <div className={styles.controls}>
                <Icon icon="addIcon" onClick={this.onAdd}/>
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default ReportsControls;
