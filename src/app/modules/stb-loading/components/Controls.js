import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'reactstrap';
import _ from 'lodash';
import ls from 'i18n';
import DatePicker from '../../../components/LabeledDateTimePicker';
import styles from './styles.scss';

class StbLoadingControls extends React.PureComponent {
    static propTypes = {
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null,
        };
    }

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value'));
    };

    onChangeStartDate = (startDate) => {
        this.setState({
            startDate,
        });
    };

    onChangeEndDate = (endDate) => {
        this.setState({
            endDate,
        });
    };

    onShow = () => {
        console.log('onShow');
    }

    render() {
        return (
            <div className={styles.controls}>
                <div className={styles.controlsGroup}>
                    <DatePicker
                        title={ls('STB_LOADING_REPORT_INTERVAL_TITLE', 'Период отчёта:')}
                        value={this.state.startDate}
                        inputWidth={80}
                        onChange={this.onChangeStartDate}
                    />
                    <DatePicker
                        title="—"
                        min={this.state.startDate}
                        value={this.state.endDate}
                        inputWidth={80}
                        onChange={this.onChangeEndDate}
                    />
                    <Button color="action" onClick={this.onShow}>
                        {ls('SHOW_BUTTON_LABEL', 'Показать')}
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

export default StbLoadingControls;
