import React from 'react';
import PropTypes from 'prop-types';
import styles from './alerts-chart.scss';
import Legend from './Legend';
import Chart from './Chart';

class ChartWrapper extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        filter: PropTypes.node,
        buildLink: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className={styles['alerts-chart']}>
                <div className={styles.head}>
                    <Legend data={this.props.data} />
                    {this.props.filter}
                </div>
                <div className={styles.body}>
                    <Chart
                        data={this.props.data}
                        from={this.props.from}
                        to={this.props.to}
                        buildLink={this.props.buildLink}
                    />
                </div>
            </div>
        );
    }
}

export default ChartWrapper;
