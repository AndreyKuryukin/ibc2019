import React from 'react';
import PropTypes from 'prop-types';

import Controls from './ReportsControls';
import Table from './ReportsTable';
import styles from './styles.scss';

class Reports extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        reportsData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        reportsData: [],
        isLoading: false,
        onMount: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    render() {
        return (
            <div className={styles.reportsWrapper}>
                <Controls
                    onSearchTextChange={this.onSearchTextChange}
                />
                <Table
                    data={this.props.reportsData}
                    searchText={this.state.searchText}
                    preloader={this.props.isLoading}
                    removeResult={this.props.removeResult}
                />
            </div>
        );
    }
}

export default Reports;
