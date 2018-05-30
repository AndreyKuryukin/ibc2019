import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import Details from "./Details";
import styles from './styles.scss';
import _ from "lodash";
import AlarmsControls from '../../../components/AlarmsControls';
import AlarmsTable from '../../../components/AlarmsTable';
import { convertUTC0ToLocal } from '../../../../../util/date';

class KqiCmp extends React.PureComponent {
    static propTypes = {
        history: PropTypes.object,
        match: PropTypes.object,
        detail: PropTypes.object,
        data: PropTypes.array,
        filter: PropTypes.object,
        onChangeFilterProperty: PropTypes.func,
        onFetchAlarms: PropTypes.func,
    };

    static defaultProps = {
        history: {},
        match: {},
        filter: null,
        onChangeFilterProperty: () => null,
        onFetchAlarms: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    mapData = memoize(data => data.map(node => ({
        id: node.id.toString(),
        policy_name: node.policy_name,
        raise_time: convertUTC0ToLocal(node.raise_time).format('HH:mm DD:MM:YYYY'),
        duration: this.getReadableDuration(node.duration),
        object: node.object,
    })));

    onApplyFilter = () => {
        this.props.onFetchAlarms(this.props.filter);
    };

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    render() {
        const { match, data, history, detail, filter, onChangeFilterProperty } = this.props;
        const { params = {} } = match;
        const { id } = params;
        return <div className={styles.kqiHistoryWrapper}>
            <AlarmsControls
                filter={filter}
                onChangeFilterProperty={onChangeFilterProperty}
                onSearchTextChange={this.onSearchTextChange}
                onApplyFilter={this.onApplyFilter}
            />
            <AlarmsTable
                data={this.mapData(data)}
                preloader={false}
                searchText={this.state.searchText}
            />
            <Details active={!_.isUndefined(id)}
                     onSubmit={() => history.push('/alarms/kqi/history')}
                     preloader={this.props.detailLoading}
                     detail={detail}
            />
        </div>;
    }
}

export default KqiCmp;
