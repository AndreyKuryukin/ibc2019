import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import BodyCell from './DrilldownBodyCell';
import Table from '../../../../../components/Table/index';
import rest from '../../../../../rest/index';
import ls from '../../../../../../i18n';
import { MACRO_RF_ID } from '../../../constants';

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
            .then(({ data }) => this.setState({ data: [this.mapDataToRows(data)] }))
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

    mapDataToRows(data) {
        const mapEntry = (node) => {
            const result = { ...node };
            if (node.rf) {
                result.items = node.rf.map(item => mapEntry(item))
            }
            return result
        };

        return mapEntry(data || {});
    }

    render() {
        return (
            <Table
                id="drilldown-table"
                className={styles.drilldownChart}
                columns={[
                    {
                        getTitle: () => 'Region',
                        name: 'name',
                    }, {
                        getTitle: () => <span>K<sub>{'sub'}</sub></span>,
                        name: 'ksub',
                    }, {
                        getTitle: () => <span>K<sub>{'khe'}</sub></span>,
                        name: 'khe',
                    }, {
                        getTitle: () => <span>K<sub>{'knet'}</sub></span>,
                        name: 'knet',
                    },
                ]}
                data={this.state.data}
                bodyRowRender={(column, row) => (
                    <BodyCell
                        column={column}
                        row={row}
                        expanded={new Set(this.state.expanded)}
                        onExpanderClick={this.onExpanderClick}
                    />
                )}
                headerRowRender={column => column.getTitle()}
            />
        );
    }
}

export default Drilldown;
