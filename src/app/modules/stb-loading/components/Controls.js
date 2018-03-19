import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import _ from 'lodash';
import ls from 'i18n';
import DatePicker from '../../../components/DatePicker';
import styles from './styles.scss';

class StbLoadingControls extends React.PureComponent {
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

    onChange = (v) => {
        console.log(v);
    };

    render() {
        return (
            <div className={styles.controls}>
                <div className={styles.controlsGroup}>
                    <DatePicker title={ls('STB_LOADING_REPORT_INTERVAL_TITLE', 'Период отчёта:')} onChange={this.onChange} />
                    <DatePicker title="—" />
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

export default StbLoadingControls;
