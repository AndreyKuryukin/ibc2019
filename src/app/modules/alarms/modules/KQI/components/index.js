import React from 'react';
import PropTypes from 'prop-types';


import Table from "./Table";
import Controls from "./Controls";
import Details from "./Details";
import styles from './styles.scss';
import _ from "lodash";

class KqiCmp extends React.PureComponent {
    static propTypes = {
        history: PropTypes.object,
        match: PropTypes.object,
        detail: PropTypes.object,
        data: PropTypes.array,
    };

    static defaultProps = {
        history: {},
        match: {},
    };

    render() {
        const { match, data, history, detail } = this.props;
        const { params = {} } = match;
        const { id } = params;
        return <div className={styles.kqiHistoryWrapper}>
            <Controls onSearchTextChange={(searchText) => this.setState({ searchText })}/>
            <Table data={data}
                   preloader={this.props.dataLoading}
                   searchText={_.get(this.state, 'searchText')}
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
