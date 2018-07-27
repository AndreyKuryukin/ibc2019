import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import BodyCell from './DrilldownBodyCell';
import HeadCell from './DrilldownHeadCell';
import Table from '../../../../../components/Table/index';
import rest from '../../../../../rest/index';
import KQI from '../../KQI';
import ls from '../../../../../../i18n';
import {MACRO_RF_ID} from '../../../constants';

class Drilldown extends React.Component {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mrfId: PropTypes.string.isRequired,
    };

    state = {
        data: {},
        expanded: [],
    };

    componentDidMount() {
        this.fetchChartData();
    }
    componentWillUpdate(nextProps) {
        if (this.props.regularity !== nextProps.regularity || this.props.mrfId !== nextProps.mrfId) {
            this.fetchChartData(nextProps).then(this.initChart);
        }
    }
    fetchChartData(props = this.props) {
        const queryParams = {
            regularity: props.regularity,
            mrf: props.mrfId,
        };
        if (queryParams.mrf === MACRO_RF_ID) {
            delete queryParams.mrf;
        }

        return rest.get('/api/v1/dashboard/drilldown', {}, { queryParams })
            .then(({ data }) => this.setState({ data }))
            .catch(console.error);
    }

    onExpanderClick = (rowId) => {
        const set = new Set(this.state.expanded);

        if (!set.delete(rowId)) {
            set.add(rowId);
        }

        this.setState({
            expanded: Array.from(set),
        });
    };

    mapDataToRows() {
        const format = number => typeof number === 'number'
            ? parseFloat(number.toFixed(2)) + '%'
            : ls('NOT_AVAILABLE', 'Н/Д');

        return Object.entries(this.state.data)
            .filter(([type, value]) => value !== null)
            .map(([type, value]) => {
                const [parameter, index] = KQI.parseType(type);

                return {
                    id: type,
                    name: '',
                    parameter,
                    index,
                    itv1: format(value.itv1),
                    itv2: format(value.itv2),
                    items: value.rf.map(rf => ({
                        id: `${type}_${rf.id}`,
                        name: rf.name,
                        parameter,
                        index,
                        itv1: format(rf.itv1),
                        itv2: format(rf.itv2),
                    })),
                };
            });
    }

    render() {
        return (
            <Table
                id="drilldown-table"
                className={styles.drilldownChart}
                columns={[
                    {
                        getTitle: () => ls('DASHBOARD_CHART_DRILLDOWN_COLUMN_NAME_TITLE', 'Показатель'),
                        name: 'name',
                    }, {
                        getTitle: () => ls('DASHBOARD_ITV', 'ИТВ'),
                        name: 'itv1',
                    }, {
                        getTitle: () => ls('DASHBOARD_ITV2_0', 'ИТВ 2.0'),
                        name: 'itv2',
                    }
                ]}
                data={this.mapDataToRows()}
                bodyRowRender={(column, row) => (
                    <BodyCell
                        column={column}
                        row={row}
                        expanded={new Set(this.state.expanded)}
                        onExpanderClick={this.onExpanderClick}
                    />
                )}
                headerRowRender={column => <HeadCell column={column} />}
            />
        );
    }
}

export default Drilldown;
