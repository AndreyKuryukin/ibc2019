import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import memoize from 'memoizejs';
import ls from 'i18n';
import TreeView from '../../../components/TreeView';
import Graph from './Graph';
import { createKRenderer } from '../../../helpers';

const KABRenderer = createKRenderer(95);

class NeighboursGrid extends React.PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        data: PropTypes.array,
    };

    prepareData = memoize(data => data.map(node => ({
        id: node.id,
        main: node.main,
        itemType: 'row',
        previousKab: _.get(node.value, '1.common', null),
        currentKab: _.get(node.value, '0.common', null),
    })).sort(node => node.main ? -1 : 1));

    renderCell = (value, item, columnKey) => {
        const { previousKab } = item;

        if (columnKey === 'currentKab') return KABRenderer(value, previousKab);
        if (columnKey === 'id' && item.main) return <i>{value}</i>;
    }

    render() {
        return (
            <TreeView
                id="neighbours-grid"
                data={this.props.isLoading ? [] : this.prepareData(this.props.data)}
                isLoading={this.props.isLoading}
                columns={[
                    {
                        getTitle: () => ls('SUBSCRIBERS_NEIGHBOURS_SERVICE_ID_COLUMN_TITLE', 'Service ID'),
                        name: 'id',
                        width: '50%',
                    }, {
                        getTitle: () => <span>К<sub>sub</sub></span>,
                        name: 'currentKab',
                        width: '50%',
                    }
                ]}
                cellRenderer={this.renderCell}
            />
        );
    }
}

export default NeighboursGrid;
