import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CalculationsTable from './CalculationsTable';
import CalculationsControls from './CalculationsControls';
import ConfigsTable from './ConfigsTable';
import ConfigsControls from './ConfigsControls';
import styles from './styles.scss';
import Configurator from '../modules/Configurator/containers';
import Calculator from '../modules/Calculator/containers';
import ResultsViewer from '../modules/ResultsViewer/components';

class KQI extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        kqiData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false,
        onMount: () => null,
    };


    constructor(props) {
        super(props);

        this.state = {
            configsSearchText: '',
            calculationsSearchText: '',
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

    onConfigsSearchTextChange = (searchText) => {
        this.setState({ configsSearchText: searchText });
    };

    onCalculationsSearchTextChange = (searchText) => {
        this.setState({ calculationsSearchText: searchText });
    };

    render() {
        const { params } = this.props.match;
        const isConfiguratorActive = params.action === 'configure';
        const isCalculatorActive = params.action === 'calculate';
        const isResultsViewerActive = params.action === 'view';

        console.log(isResultsViewerActive);

        return (
            <div className={styles.kqiWrapper}>
                <div className={classnames(styles.kqiColumn, styles.configsTableContainer)}>
                    <ConfigsControls onSearchTextChange={this.onConfigsSearchTextChange} />
                    <ConfigsTable
                        data={this.props.kqiData}
                        searchText={this.state.configsSearchText}
                        preloader={this.props.isLoading}
                    />
                </div>
                <div className={classnames(styles.kqiColumn, styles.calculationsTableContainer)}>
                    <CalculationsControls onSearchTextChange={this.onCalculationsSearchTextChange} />
                    <CalculationsTable
                        data={this.props.kqiData}
                        searchText={this.state.calculationsSearchText}
                        preloader={this.props.isLoading}
                    />
                </div>
                {isConfiguratorActive && <Configurator active={isConfiguratorActive} />}
                {isCalculatorActive && <Calculator active={isCalculatorActive} />}
                {isResultsViewerActive && <ResultsViewer active={isResultsViewerActive} />}
            </div>
        );
    }

}

export default KQI;
