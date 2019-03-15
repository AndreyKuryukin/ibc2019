import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import { connect } from 'react-redux';
import ls from 'i18n';
import classNames from 'classnames';
import styles from './styles.scss';
import chartStyles from '../../../../components/Pages/alerts/Chart/chart.scss';
import Chart from '../../../../components/Pages/alerts/Chart/Chart';
import Preloader from '../../../../../../components/Preloader';
import Item from './Item';
import { selectRangeDates } from '../../../../reducers/pages/alerts';
import { convertUTC0ToLocal } from '../../../../../../util/date';
import * as _ from "lodash";

const groupStyle = { marginBottom: 5 };

const COLORS = {
    LIVE: '#7cc032',
    PVR: '#377dc4',
    VOD: '#7837c4',
};

class ChartWrapper extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startDate: PropTypes.number.isRequired,
        endDate: PropTypes.number.isRequired,
    };

    state = { activeGroup: '' };

    prepareData = memoize(data =>
        _.chain(data)
            .reduce((acc, node, i) => {
                const preparedAlert = {
                    id: 'Channel-' + i,
                    group: node.channel_name,
                    kab: node.kab,
                    contentType: node.content_type,
                    startTime: convertUTC0ToLocal(node.start_date).valueOf(),
                    endTime: convertUTC0ToLocal(node.end_date).valueOf(),
                    err_intervals: node.err_intervals
                };

                if (acc[node.channel_name]) {
                    return {
                        ...acc,
                        [node.channel_name]: {
                            ...acc[node.channel_name],
                            alerts: [...acc[node.channel_name].alerts, preparedAlert],
                        },
                    };
                } else {
                    return {
                        ...acc,
                        [node.channel_name]: {
                            name: node.channel_name,
                            alerts: [preparedAlert],
                        },
                    };
                }
            }, {})
            .value()
    );

    renderErrInterval = (alert, start, duration) => (
        <Item
            id={alert.id}
            from={(alert.startTime - start) / duration}
            duration={(alert.endTime - alert.startTime) / duration}
            isAlert
        />
    );

    itemRenderer = (alert, graphBounds) => {
        const duration = graphBounds.to - graphBounds.from;

        return (
            <Item
                id={alert.id}
                from={(alert.startTime - graphBounds.from) / duration}
                duration={(alert.endTime - alert.startTime) / duration}
                data={{
                    channel_name: alert.group,
                    startTime: alert.startTime,
                    endTime: alert.endTime,
                    kab: alert.kab,
                }}
                color={COLORS[alert.contentType]}
                onMouseEnter={() => this.onMouseEnter(alert.group)}
                onMouseLeave={this.onMouseLeave}
            >{alert.err_intervals.map(err_interval => this.renderErrInterval({
                id: `${err_interval.start_date}-${err_interval.end_date}`,
                startTime: convertUTC0ToLocal(err_interval.start_date).valueOf(),
                endTime: convertUTC0ToLocal(err_interval.end_date).valueOf(),
            }, alert.startTime, alert.endTime - alert.startTime))}</Item>
        );
    };

    groupRenderer = (data, graphBounds) =>
        Object.values(data).map((group, i) => {
            const { alerts } = group;

            return (
                <div
                    key={'group-' + i}
                    className={chartStyles.group}
                    style={groupStyle}
                >
                    {alerts.map(alert => this.itemRenderer(alert, graphBounds))}
                </div>
            )
        });

    onMouseEnter = (groupName) => {
        this.setState({ active: groupName });
    };

    onMouseLeave = () => {
        this.setState({ active: '' });
    };

    render() {
        const { data, startDate, endDate } = this.props;
        const preparedData = this.prepareData(data);

        return (
            <Preloader active={this.props.isLoading}>
                <div className={styles.mcastChart}>
                    <div className={styles.head}>
                        <div className={styles.title}>{ls('SUBSCRIBERS_MCAST_GRAPH_CHANNEL_NAME', 'Название канала')}</div>
                        <div className={styles.legend}>
                            {Object.keys(COLORS).map(key => (
                                <div className={styles.item}>
                                    <div
                                        className={styles.icon}
                                        style={{ background: COLORS[key] }}
                                    />
                                    <span>{key}</span>
                                </div>
                            ))}
                            <div className={styles.item}>
                                <div
                                    className={styles.icon}
                                    style={{ background: '#ff0000' }}
                                />
                                <span>{ls('SUBSCRIBERS_MCAST_GRAPH_ALERTS_TITLE', 'Аварии')}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.groupsColumn}>
                            {Object.values(preparedData).map((group, i) => (
                                <div
                                    className={classNames(styles.groupName, { active: this.state.active === group.name })}
                                    title={group.name}
                                >{group.name}</div>
                            ))}
                        </div>
                        <Chart
                            data={this.props.isLoading ? [] : preparedData}
                            from={startDate}
                            to={endDate}
                            groupRenderer={this.groupRenderer}
                        />
                    </div>
                </div>
            </Preloader>
        );
    }
}

const mapStateToProps = (state, props) => {
    const { startDate, endDate } = selectRangeDates(state);

    const dataStart = _.get(props.data, '0.start_date');
    const dataEnd = _.get(props.data, `${props.data.length - 1}.end_date`);
    const from = dataStart ? convertUTC0ToLocal(dataStart).valueOf() : startDate;
    const to = dataEnd ? convertUTC0ToLocal(dataEnd).valueOf() : endDate;

    return {
        startDate: from,
        endDate: to,
    };
};

export default connect(mapStateToProps, null)(ChartWrapper);
