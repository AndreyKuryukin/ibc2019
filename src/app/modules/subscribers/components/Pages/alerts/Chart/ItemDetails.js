import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {Popover, PopoverBody} from 'reactstrap';
import styles from './item-details.scss';
import ls from "i18n";

class ItemDetails extends React.Component {
    static propTypes = {
        target: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        isShown: PropTypes.bool.isRequired,
        data: PropTypes.shape({
            type: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number,
            closed: PropTypes.bool.isRequired,
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

    renderStatus(closed) {
        if (closed) {
            return <span style={{color: 'green'}}>Closed</span>;
        }
        return <span style={{color: 'red'}}>Open</span>;
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
                        <b>{'Alert type'}:</b> {data.type} <Link to={this.props.link} className={styles['details-link']}>{'More'}</Link>
                    </span>
                </PopoverBody>
                <PopoverBody>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>{'Raise time'}:</b> {this.formatTime(data.startTime)}<br />
                    </span>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>{'Cease time'}:</b> {data.closed ? this.formatTime(data.endTime) : '-'}
                    </span>
                </PopoverBody>
                <PopoverBody>
                    <span style={{whiteSpace: 'nowrap'}}>
                        <b>{'Status'}:</b> {this.renderStatus(data.closed)}
                    </span>
                </PopoverBody>
            </Popover>
        );
    }
}

export default ItemDetails;
