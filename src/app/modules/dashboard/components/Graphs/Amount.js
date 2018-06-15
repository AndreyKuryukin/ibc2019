import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import rest from '../../../../rest';

Drilldown(Highcharts);

const colors = {
    FTTB: 'rgb(124, 192, 50)', //#7cc032',
    GPON: 'rgb(55, 125, 196)', //#377dc4',
    XDSL: 'rgb(253, 127, 0)', //#fd7f00',
    FTTB_broken: 'rgba(124, 192, 50, 0.6)',
    GPON_broken: 'rgba(55, 125, 196, 0.6)',
    XDSL_broken: 'rgba(253, 127, 0, 0.6)',
};

class Amount extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string,
    };

    chart = null;
    state = {
        data: {},
    };

    componentDidMount() {
        this.fetchChartData().then(this.initChart);
    }
    componentWillUnmount() {
        if (this.chart !== null) {
            this.chart.destroy();
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            if (this.chart !== null) {
                this.chart.destroy();
            }
            this.fetchChartData(nextProps).then(this.initChart);
        }
    }

    initChart = () => {
        const options = {
            chart: {
                type: 'pie',
                width: this.container.offsetWidth,
            },
            title: {
                text: 'Количество STB ИТВ МРФ Волга',
                align: 'left',
            },
            tooltip: {
                shared: true,
                backgroundColor: '#082545',
                borderRadius: 7,
                borderWidth: 0,
                style: {
                    color: 'white',
                },
                useHTML: true,
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    center: ['50%', '50%'],
                }
            },
            series: [{
                name: 'Amount',
                colorByPoint: true,
                size: '100%',
                innerSize: '80%',
                data: this.getSeries(),
            }],
        };

        this.chart = new Highcharts.Chart(
            this.container,
            options
        );
    };

    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };

        return rest.get('/api/v1/dashboard/abonents', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    getSeries() {
        return Object.entries(this.state.data).reduce((result, [key, { total, broken }], i, ar) => {
            result.push({
                name: key,
                y: total,
                color: colors[key],
            });
            result.push({
                name: `Аварийные ${key}`,
                y: total,
                color: colors[`${key}_broken`],
                legendIndex: i + ar.length,
            });
            return result;
        }, []);
    }

    render() {
        return (
            <div
                ref={container => this.container = container}
                style={{ width: '100%' }}
            />
        );
    }
}

export default Amount;
