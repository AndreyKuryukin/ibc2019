import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Chart from './Chart';

let tooltipTimer;

class ConnectedChart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        connectedTo: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired,
    };

    chart = null;

    mouseMoveHandler = (e) => {
        const oppositeChart = Highcharts.charts.find(
            chart => chart !== undefined && chart.options.id === this.props.connectedTo
        );

        if (oppositeChart !== undefined) {
            const event = oppositeChart.pointer.normalize(e);
            const point = oppositeChart.series[0].searchPoint(event, true);

            if (point) {
                point.onMouseOver();
                point.series.chart.xAxis[0].drawCrosshair(
                    point.series.chart.pointer.normalize(event),
                    point
                );
            }
        }
    };

    addMouseMoveListener = () => {
        this.chart.container.addEventListener('mousemove', this.mouseMoveHandler);

        if (tooltipTimer) {
            clearTimeout(tooltipTimer);
        }

        this.setTooltipVisibility('visible');
    };

    removeMouseMoveListener = (e) => {
        this.chart.container.removeEventListener('mousemove', this.mouseMoveHandler);

        const oppositeChart = Highcharts.charts.find(
            chart => chart !== undefined && chart.options.id === this.props.connectedTo
        );

        const event = oppositeChart.pointer.normalize(e);
        const point = oppositeChart.series[0].searchPoint(event, true);

        if (oppositeChart !== undefined) {
            if (point) {
                point.onMouseOut();
            }
            oppositeChart.tooltip.hide();
            oppositeChart.xAxis[0].hideCrosshair();

            tooltipTimer = setTimeout(() => { this.setTooltipVisibility('hidden'); }, this.props.options.tooltip.hideDelay || 500);
            this.chart.chart.xAxis[0].hideCrosshair();
        }
    };

    setTooltipVisibility = (visibility) => {
        // There is a bug when you hover a point and then the legend or header, tooltip doesn't disappear even using tooltip.hide().
        // So need to hide manually.
        this.chart.container.querySelectorAll('.highcharts-tooltip').forEach((node) => {
            if (node.style.visibility !== visibility) {
                node.style.visibility = visibility;
            }
        });
    };

    render() {
        return (
            <Chart
                ref={chart => this.chart = chart}
                options={{
                    ...this.props.options,
                    id: this.props.id,
                    chart: {
                        ...this.props.options.chart,
                        marginLeft: 50,
                    },
                    plotOptions: {
                        ...this.props.options.plotOptions,
                        series: {
                            events: {
                                mouseOver: this.addMouseMoveListener,
                                mouseOut: this.removeMouseMoveListener,
                            },
                        },
                    },
                }}
            />
        );
    }
}

export default ConnectedChart;
