import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popover, PopoverBody } from 'reactstrap';
import ls from 'i18n';
import styles from '../../../../components/Pages/alerts/Chart/item-details.scss';
import { createKRenderer } from '../../../../helpers';

const KABRenderer = createKRenderer(95);

class ItemDetails extends React.Component {
    static propTypes = {
        target: PropTypes.string.isRequired,
        isShown: PropTypes.bool.isRequired,
        data: PropTypes.shape({
            channel_name: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number,
            kab: PropTypes.bool.isRequired,
        }).isRequired,
    };
    static defaultProps = {
        isShown: false,
    };

    state = {
        isOpen: false,
    };

    onMouseEnter = () => {
        this.setState({
            isOpen: true,
        });
    };
    onMouseLeave = () => {
        this.setState({
            isOpen: false,
        });
    };

    formatTime(time) {
        if (time === null) return '-';
        return moment(time).format('HH:mm DD.MM.YYYY');
    }

    render() {
        const {target, isShown, data} = this.props;

        return (
            <Popover
                target={target}
                isOpen={isShown || this.state.isOpen}
                placement="bottom"
                className={styles['white-popover']}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <PopoverBody>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>Начало интервала:</b> {this.formatTime(data.startTime)}<br />
                    </span>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>Конец интервала:</b> {this.formatTime(data.endTime)}
                    </span>
                </PopoverBody>
                <PopoverBody>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>{ls('SUBSCRIBERS_MCAST_CHANNEL_NAME_COLUMN_TITLE', 'Название канала') + ':'}</b> {data.channel_name}
                    </span>
                </PopoverBody>
                <PopoverBody>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>{ls('DASHBOARD_PARAMETER_LETTER', 'К')}<sub>sub</sub></b> {KABRenderer(data.kab)}
                    </span>
                </PopoverBody>
            </Popover>
        );
    }
}

export default ItemDetails;
