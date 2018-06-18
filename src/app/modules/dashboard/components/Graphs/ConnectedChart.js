import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Chart from './Chart';

class ConnectedChart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        connectedTo: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired,
    };

    chart = null;

    componentDidMount() {
        const getOppositeChart = () => Highcharts.charts.find(
            chart => chart !== undefined && chart.options.id === this.props.connectedTo
        );

        this.chart.container.addEventListener('mousemove', (e) => {
            const chart = getOppositeChart();

            if (chart !== undefined) {
                const event = chart.pointer.normalize(e);
                const point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.onMouseOver();
                    point.series.chart.xAxis[0].drawCrosshair(
                        point.series.chart.pointer.normalize(event),
                        point
                    );
                }
            }
        });
    }

    render() {
        return (
            <Chart
                ref={chart => this.chart = chart}
                options={{
                    ...this.props.options,
                    id: this.props.id,
                }}
            />
        );
    }
}

export default ConnectedChart;
