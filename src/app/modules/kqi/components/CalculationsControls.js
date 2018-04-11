import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import _ from 'lodash';
import ls from 'i18n';
import styles from './styles.scss';
import Icon from "../../../components/Icon/Icon";

class CalculationsControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value'));
    };

    onCalculate = () => {
        this.context.history.push('/kqi/calculate');
    };

    render() {
        return (
            <div className={styles.kqiControls}>
                <div className={styles.buttonsGroup}>
                    <Icon icon="addIcon" onClick={this.onCalculate} />
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

export default CalculationsControls;

