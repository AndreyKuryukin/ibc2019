import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import moment from 'moment';
import _ from 'lodash';
import ls from 'i18n';
import TreeView from '../../../components/TreeView';
import { createKRenderer } from '../../../helpers';

const KABRenderer = createKRenderer(95);

class McastGrid extends React.PureComponent {
	static propTypes = {
		isLoading: PropTypes.bool.isRequired,
		data: PropTypes.array,
	};

	mapData = memoize(data => data.map(node => ({
        interval: moment(node.start_date).format('DD.MM.YYYY HH:mm') + ' - ' + moment(node.end_date).format('DD.MM.YYYY HH:mm'),
        mcastIp: node.player_url ? _.get(node.player_url.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/), '0', '') : '',
        channel_name: node.channel_name ? node.channel_name : '',
        content_type: node.content_type ? node.content_type : '',
        kab: node.kab && _.isNumber(node.kab) ? node.kab : '',
    })));

    renderCell = (value, item, columnKey) => {
        if (columnKey === 'kab') return KABRenderer(value, value);
    };

    render() {
		return (
			<TreeView 
				id="mcast-grid"
                data={this.props.isLoading ? [] : this.mapData(this.props.data)}
                isLoading={this.props.isLoading}
                columns={[
            		{
                        getTitle: () => ls('SUBSCRIBERS_MCAST_INTERVAL_COLUMN_TITLE', 'Интервал'),
                        name: 'interval',
                        width: '30%',
                    }, {
                        getTitle: () => 'Multicast IP',
                        name: 'mcastIp',
                        width: '15%',
                    }, {
                        getTitle: () => 'Channel name',
                        name: 'channel_name',
                        width: '25%',
                    }, {
                        getTitle: () => ls('SUBSCRIBERS_MCAST_CONTENT_TYPE_COLUMN_TITLE', 'Тип сервиса'),
                        name: 'content_type',
                        width: '10%',
                    }, {
                        getTitle: () => <span>{'KQI'}<sub>sub</sub></span>,
                        name: 'kab',
                        width: '20%',
                    }
                ]}
                cellRenderer={this.renderCell}
			/>	
		);
	}
}

export default McastGrid;
