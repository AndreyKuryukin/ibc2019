import React from 'react';
import PropTypes from 'prop-types';

import TreeView from '../../../components/TreeView';
import Graph from './Graph';
import LoadingNode from "../../../components/TreeView/LoadingNode";
import * as _ from "lodash";
import memoize from "memoizejs";
import ls from "i18n";

function formatMetric(metric, decimalPlaces) {
    if (typeof metric !== 'number') return '-';
    const dPlaces = _.isNumber(decimalPlaces) ? decimalPlaces : 2;

    return metric.toFixed(dPlaces);
}

const noDataStyle = { height: '50px', textAlign: 'center', lineHeight: '50px' };
const loadingNodeStyle = { height: 50, display: 'flex' };

export const getMetricsTranslation = key => ({
    SPY_METRIC_MEDIA_BITRATE: ls('SPY_METRIC_MEDIA_BITRATE', 'Битрейт медиапотока'),
    SPY_METRIC_IFACE_ETH_MODE: ls('SPY_METRIC_IFACE_ETH_MODE', 'Режим работы ethernet порта'),
    UNIT_KbPS: ls('UNIT_KbPS', 'Кбит/с'),
    SPY_METRIC_IFACE_ETH_MODE_0: ls('SPY_METRIC_IFACE_ETH_MODE_0', 'Неизвестно'),
    SPY_METRIC_IFACE_ETH_MODE_1: ls('SPY_METRIC_IFACE_ETH_MODE_1', '10 Мбит/с полудуплекс'),
    SPY_METRIC_IFACE_ETH_MODE_2: ls('SPY_METRIC_IFACE_ETH_MODE_2', '10 Мбит/с полный дуплекс'),
    SPY_METRIC_IFACE_ETH_MODE_3: ls('SPY_METRIC_IFACE_ETH_MODE_3', '100 Мбит/с полудуплекс'),
    SPY_METRIC_IFACE_ETH_MODE_4: ls('SPY_METRIC_IFACE_ETH_MODE_4', '100 Мбит/с полный дуплекс'),
    SPY_METRIC_IFACE_ETH_MODE_5: ls('SPY_METRIC_IFACE_ETH_MODE_5', 'Зарезервировано'),
    SPY_METRIC_IFACE_ETH_MODE_6: ls('SPY_METRIC_IFACE_ETH_MODE_6', '1Гбит/с полный дуплекс"'),
}[key] || key);

class MetricsGrid extends React.Component {
    static propTypes = {
        subscriber: PropTypes.shape({
            service_id: PropTypes.string.isRequired,
            affilate_id: PropTypes.string.isRequired,
        }),
        hoursLimit: PropTypes.number.isRequired,
        metrics: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            LAST: PropTypes.number,
            MIN: PropTypes.number,
            MAX: PropTypes.number,
            AVG: PropTypes.number,
        })).isRequired,
        parameters: PropTypes.object,
        isLoading: PropTypes.bool.isRequired,
        fetchStbData: PropTypes.func.isRequired,
        range: PropTypes.string,
    };

    state = {
        data: [],
    };

    lastRequest = null;

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.metrics, this.props.metrics)) {
            this.setState({ data: this.mapData(nextProps.metrics, nextProps.parameters) });
        }
    }

    mapData = memoize((metrics, parameters) => {
        return metrics.map(metric => {
            const parameter = _.get(parameters, metric.name);
            const transformedMetric = { ...this.transformMetricNode(metric, parameter) };

            if (transformedMetric.type !== 'string') {
                transformedMetric.children = [{
                    graph: true,
                    id: metric.name,
                    getData: (() => {
                        let data = false;
                        let request = false;
                        return () => {
                            if (!request) {
                                this.props.fetchStbData(metric.name).then((respData) => {
                                    data = Object.keys(respData).reduce((acc, key) => [
                                        ...acc,
                                        {
                                            ...(parameter.type === 'int' || parameter.type === 'double'
                                                ? this.transformMetricValues(respData[key], parameter)
                                                : this.transformMetricValues(respData[key])
                                            ),
                                            time: key,
                                            unit: parameter.unit ? getMetricsTranslation(parameter.unit_translation_key) || '' : '',
                                            type: parameter.type,
                                            dict_content_translation_keys: parameter.dict_content_translation_keys,
                                        }
                                    ], []);
                                    this.forceUpdate();
                                });
                                request = true;
                            }
                            return data;
                        };
                    })(),
                }];
            }

            return transformedMetric;
        });
    });

    transformMetricValues = (metric, parameter) => {
        if (parameter) {
            switch(parameter.type) {
                case 'dict':
                    return {
                        // avg: getMetricsTranslation(_.get(parameter.dict_content_translation_keys, node.AVG, node.AVG)),
                        avg: '-',
                        last: getMetricsTranslation(_.get(parameter.dict_content_translation_keys, metric.LAST, metric.LAST)),
                        max: getMetricsTranslation(_.get(parameter.dict_content_translation_keys, metric.MAX, metric.MAX)),
                        min: getMetricsTranslation(_.get(parameter.dict_content_translation_keys, metric.MIN, metric.MIN)),
                    };
                case 'string': {
                    return {
                        avg: '-',
                        last: '-',
                        max: '-',
                        min: '-',
                    };
                }
                case 'double': {
                    const unit = parameter.unit ? getMetricsTranslation(parameter.unit_translation_key) || '' : '';
                    return {
                        avg: formatMetric(metric.AVG, parameter.double_decimal_places) + ' ' + unit,
                        last: formatMetric(metric.LAST, parameter.double_decimal_places) + ' ' + unit,
                        max: formatMetric(metric.MAX, parameter.double_decimal_places) + ' ' + unit,
                        min: formatMetric(metric.MIN, parameter.double_decimal_places) + ' ' + unit,
                    };
                }
                case 'int':
                default:
                    const unit = parameter.unit ? getMetricsTranslation(parameter.unit_translation_key) || '' : '';
                    return {
                        avg: formatMetric(metric.AVG, parameter.double_decimal_places) + ' ' + unit,
                        last: formatMetric(metric.LAST, 0) + ' ' + unit,
                        max: formatMetric(metric.MAX, 0) + ' ' + unit,
                        min: formatMetric(metric.MIN, 0) + ' ' + unit,
                    };
            };
        } else {
            return {
                avg: formatMetric(metric.AVG, 2),
                last: formatMetric(metric.LAST, 0),
                max: formatMetric(metric.MAX, 0),
                min: formatMetric(metric.MIN, 0),
            };
        }
    };

    transformMetricNode = (node, parameter) => ({
        id: node.name,
        type: _.get(parameter, 'type'),
        name: getMetricsTranslation(_.get(parameter, 'display_name_translation_key')) || _.get(parameter, 'display_name') || node.name,
        ...this.transformMetricValues(node, parameter),
    });

    renderGraph = (data, range, id) => {
        return <Graph
            id={id}
            key={id}
            data={data}
            periodUnit={range}/>
    };

    renderNoData = () => {
        return <span style={noDataStyle}>
                {ls('SUBSCRIBERS_METRICS_GRAPH_NO_DATA_TITLE', 'Нет данных')}
            </span>
    };

    renderItem = (item, { collapsed }) => {
        if (!item.graph || collapsed) return;

        const data = item.getData();

        if (data === false) return (
            <div style={loadingNodeStyle}>
                <LoadingNode small />
            </div>
        );

        let component;
        if (data && !_.isEmpty(data)) {
            component = this.renderGraph(data, this.props.range, item.id)
        } else {
            component = this.renderNoData();
        }

        return component;
    };

    render() {
        return (
            <TreeView
                id="subscriber-metrics"
                data={this.state.data}
                isLoading={this.props.isLoading}
                itemRenderer={this.renderItem}
                columns={[
                    {
                        getTitle: () => 'Метрики',
                        name: 'name',
                        width: '40%',
                    }, {
                        getTitle: () => 'Последнее значение',
                        name: 'last',
                        width: '15%',
                    }, {
                        getTitle: () => 'Минимальное',
                        name: 'min',
                        width: '15%',
                    }, {
                        getTitle: () => 'Максимальное',
                        name: 'max',
                        width: '15%',
                    }, {
                        getTitle: () => 'Среднее',
                        name: 'avg',
                        width: '15%',
                    },
                ]}
            />
        );
    }
}

export default MetricsGrid;
