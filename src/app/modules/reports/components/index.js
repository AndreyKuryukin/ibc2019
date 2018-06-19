import React from 'react';
import PropTypes from 'prop-types';

import Controls from './ReportsControls';
import Table from './ReportsTable';
import styles from './styles.scss';
import ConfigEditor from '../modules/ConfigEditor/containers';

class Reports extends React.PureComponent {
    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        users: PropTypes.array,
        reportsData: PropTypes.array,
        isLoading: PropTypes.bool,
        fetchReports: PropTypes.func,
        onRemoveResult: PropTypes.func,
        onResultRetry: PropTypes.func,
    };

    static childContextTypes = {
        history: PropTypes.object
    };

    static defaultProps = {
        users: [],
        reportsData: [],
        isLoading: false,
        fetchReports: () => null,
        onRemoveResult: () => null,
        onResultRetry: () => null,
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

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    onSubmitConfig = () => {
        if (typeof this.props.fetchReports === 'function') {
            this.props.fetchReports();
        }
    };

    render() {
        const { match } = this.props;
        const { params } = match;
        const isEditorActive = this.context.hasAccess('REPORTS', 'EDIT') && params.action === 'add';

        return (
            <div className={styles.reportsWrapper}>
                <Controls
                    onSearchTextChange={this.onSearchTextChange}
                />
                <Table
                    data={this.props.reportsData}
                    users={this.props.users}
                    searchText={this.state.searchText}
                    preloader={this.props.isLoading}
                    onRemoveResult={this.props.onRemoveResult}
                    onResultRetry={this.props.onResultRetry}
                />
                {isEditorActive && <ConfigEditor
                    active={isEditorActive}
                    onSubmitConfig={this.onSubmitConfig}
                />}
            </div>
        );
    }
}

export default Reports;
