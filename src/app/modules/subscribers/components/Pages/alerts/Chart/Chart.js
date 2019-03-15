import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import chart from './chart.scss';
import Item from './Item';
import cn from 'classnames';

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

class Chart extends React.PureComponent {
    static propTypes = {
        data: PropTypes.objectOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            color: PropTypes.string,
            alerts: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                group: PropTypes.string.isRequired,
                closed: PropTypes.bool,
                startTime: PropTypes.number.isRequired,
                endTime: PropTypes.number,
            })).isRequired,
        })).isRequired,
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        buildLink: PropTypes.func,
        groupRenderer: PropTypes.func,
        itemRenderer: PropTypes.func,
    };

    static defaultProps = {
        groupRenderer: null,
        itemRenderer: null,
    };

    getRange() {
        const {from, to} = this.props;
        const duration = to - from;

        let start;
        let end;

        if (duration <= HOUR) {
            start = moment(from).minutes(Math.ceil(moment(from).minutes() / 5) * 5).valueOf();
            end = moment(start).add(1, 'hour').valueOf();
        } else if (duration <= DAY) {
            start = moment(from).startOf('hour').valueOf();
            end = moment(start).add(25, 'hour').valueOf();
        } else if (duration <= WEEK) {
            start = moment(from).startOf('day').valueOf();
            end = moment(to).startOf('day').add(1, 'day').valueOf();
        } else {
            start = moment(from).startOf('day').valueOf();
            end = moment(to).startOf('day').add(1, 'day').valueOf();
        }

        return {
            from: start,
            to: end,
        };
    }

    getGroups() {
        const lines = [];
        for (const group of Object.values(this.props.data)) {
            for (const alert of group.alerts) {
                let freeLine = null;
                for (const line of lines) {
                    freeLine = line;

                    for (const item of line) {
                        if (alert.startTime < (item.endTime || Date.now()) && (alert.endTime || Date.now()) > item.startTime) {
                            freeLine = null;
                            break;
                        }
                    }

                    if (freeLine !== null) break;
                }
                if (freeLine === null) {
                    freeLine = [];
                    lines.push(freeLine);
                }
                freeLine.push(alert);
            }
        }
        return lines;
    }

    getLines() {
        const {from, to} = this.getRange();
        const duration = to - from;

        const result = [];

        if (duration <= HOUR) {
            for (let minutes = 0; minutes <= 60; minutes += 5) {
                const time = from + minutes * 60 * 1000;
                const caption = moment(time).format('HH:mm');
                result.push({
                    caption,
                });
            }
        } else if (duration <= DAY + HOUR) {
            for (let hours = 0; hours <= 24; hours += 1) {
                const time = from + hours * 60 * 60 * 1000;
                let name;
                let caption;
                if (moment(time).hour() === 0) {
                    name = moment(time).format('D MMMM YYYY').toLowerCase();
                }
                if (moment(time).hour() % 2 === 0){
                    caption = moment(time).format('HH:mm');
                }
                result.push({
                    caption,
                    bordered: name !== undefined,
                    name,
                });
            }
        } else if (duration <= WEEK + DAY) {
            for (let time = from; time <= to; time += DAY) {
                let name;
                if (moment(time).date() === 1) {
                    name = moment(time).format('D MMMM YYYY').toLowerCase();
                }

                result.push({
                    caption: moment(time).format('DD.MM'),
                    bordered: name !== undefined,
                    name,
                });
            }
        } else {
            for (let time = from; time <= to; time += DAY) {
                let name;
                let caption;
                if (moment(time).date() === 1) {
                    name = moment(time).format('D MMMM YYYY').toLowerCase();
                }
                if (moment(time).date() % 3 === 0) {
                    caption = moment(time).format('DD.MM');
                }

                result.push({
                    caption,
                    bordered: name !== undefined,
                    name,
                });
            }
        }

        return result;
    }

    render() {
        const {from, to} = this.getRange();
        const duration = to - from;

        return (
            <div className={chart.chart}>
                <div className={chart.alerts}>
                    {!this.props.groupRenderer ? this.getGroups().map((group, i) => (
                        <div
                            key={i}
                            className={chart.group}
                        >
                            {group.map(alert => !this.props.itemRenderer ? (
                                <Item
                                    key={alert.id}
                                    id={alert.id}
                                    color={this.props.data[alert.group].color}
                                    closed={alert.closed}
                                    from={(alert.startTime - from) / duration}
                                    duration={(alert.endTime - alert.startTime) / duration}
                                    data={{
                                        type: this.props.data[alert.group].name,
                                        startTime: alert.startTime,
                                        endTime: alert.endTime,
                                        closed: alert.closed,
                                    }}
                                    buildLink={this.props.buildLink}
                                />
                            ) : this.props.itemRenderer(alert, { from, to }))}
                        </div>
                    )) : this.props.groupRenderer(this.props.data, { from, to })}
                </div>
                <div className={cn(chart.axis, chart.vertical)} />
                <div className={cn(chart.axis, chart.horizontal)} />
                <div className={chart.plot}>
                    {this.getLines().map((line, i) => (
                        <div
                            key={`${from} ${to} ${i}`}
                            className={cn(chart.line, {
                                [chart.bordered]: line.bordered,
                                [chart.transparent]: line.caption === undefined,
                            })}
                        >
                            <span className={chart.caption}>{line.caption}</span>
                            {line.name !== undefined && <span className={chart.name}>{line.name}</span>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Chart;
