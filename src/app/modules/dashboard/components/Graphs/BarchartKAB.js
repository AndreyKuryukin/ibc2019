import React from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import rest from '../../../../rest';
import ls from '../../../../../i18n';

class BarchartKAB extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    state = {
        data: [],
    };

    componentDidMount() {
        this.fetchChartData()
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            this.fetchChartData(nextProps);
        }
    }

    getChartOptions = () => {
        return {
            chart: {
                type: 'column',
            },
            title: {
                ...Chart.DEFAULT_OPTIONS.title,
                text: ls('DASHBOARD_CHART_BARCHART_KAB_TITLE', 'Каб по РФ'),
            },
            xAxis: {
                ...Chart.DEFAULT_OPTIONS.xAxis,
                categories: this.getCategories(),
            },
            yAxis: {
                ...Chart.DEFAULT_OPTIONS.yAxis,
                max: 100,
                min: this.getMin(),
            },
            plotOptions: {
                column: Chart.DEFAULT_OPTIONS.plotOptions.column,
            },
            colors: [
                '#082545',
                '#7cc032',
                '#fc3737',
            ],
            series: this.getSeries(),
        };
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };

        return rest.get('/api/v1/dashboard/barchart/kab', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        const previous = this.state.data.map(item => item.previous);

        return [
            {
                name: ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_PREVIOUS', 'Предыдущий'),
                data: previous,
            }, {
                name: ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_NORMAL', 'Нормальный'),
                data: this.state.data.map((item, i) => ({
                    y: item.current,
                    color: item.current >= previous[i] ? '#7cc032' : '#fc3737',
                })),
            }, {
                name: ls('DASHBOARD_CHART_BARCHART_KAB_LEGEND_CRITITCAL', 'Критический'),
                color: '#fc3737',
            },
        ];
    }
    getCategories() {
        return this.state.data.map(item => item.name);
    }
    getMin() {
        const min = Math.min(...this.state.data.reduce((acc, item) => [...acc, item.current, item.previous], []));

        return Math.max(0, min - (100 - min) * 0.1);
    }

    render() {
        return <Chart options={this.getChartOptions()} />;
    }
}

export default BarchartKAB;
