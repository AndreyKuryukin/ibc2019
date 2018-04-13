import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ProjectionsTable from './ProjectionsTable';
import ProjectionsControls from './ProjectionsControls';
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
        projectionsData: PropTypes.array,
        isConfigsLoading: PropTypes.bool,
        isProjectionsLoading: PropTypes.bool,
        onMount: PropTypes.func,
        onSelectConfig: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        projectionsData: [],
        isConfigsLoading: false,
        isProjectionsLoading: false,
        onMount: () => null,
        onSelectConfig: null,
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

    onResultsViewerClose = () => {
        const { params } = this.props.match;
        const configId = params.configId || null;

        this.props.history.push(`/kqi/view/${configId}`);
    };

    render() {
        const { params } = this.props.match;
        const isConfiguratorActive = params.action === 'configure';
        const isCalculatorActive = params.action === 'calculate';
        const isResultsViewerActive = !!params.projectionId;
        const configId = params.configId || null;

        return (
            <div className={styles.kqiWrapper}>
                <div className={classnames(styles.kqiColumn, styles.configsTableContainer)}>
                    <ConfigsControls onSearchTextChange={this.onConfigsSearchTextChange} />
                    <ConfigsTable
                        data={this.props.kqiData}
                        searchText={this.state.configsSearchText}
                        preloader={this.props.isConfigsLoading}
                        onSelectConfig={this.props.onSelectConfig}
                    />
                </div>
                <div className={classnames(styles.kqiColumn, styles.calculationsTableContainer)}>
                    <ProjectionsControls onSearchTextChange={this.onCalculationsSearchTextChange} />
                    <ProjectionsTable
                        data={this.props.projectionsData}
                        searchText={this.state.calculationsSearchText}
                        preloader={this.props.isProjectionsLoading}
                        configId={configId}
                    />
                </div>
                {isConfiguratorActive && <Configurator active={isConfiguratorActive} />}
                {isCalculatorActive && <Calculator active={isCalculatorActive} />}
                {isResultsViewerActive && <ResultsViewer active={isResultsViewerActive} onClose={this.onResultsViewerClose} />}
            </div>
        );
    }

}

export default KQI;
