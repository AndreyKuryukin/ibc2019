import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ls from 'i18n';
import { createSelector } from 'reselect';
import _ from 'lodash';
import ProjectionsTable from './ProjectionsTable';
import ProjectionsControls from './ProjectionsControls';
import ConfigsTable from './ConfigsTable';
import ConfigsControls from './ConfigsControls';
import styles from './styles.scss';
import Configurator from '../modules/Configurator/containers';
import Calculator from '../modules/Calculator/containers';
import ResultsViewer from '../modules/ResultsViewer/containers';
import Panel from '../../../components/Panel';

const panelBodyStyle = { padding: 0 };

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
        onEditConfig: PropTypes.func,
        onDeleteConfig: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        projectionsData: [],
        isConfigsLoading: false,
        isProjectionsLoading: false,
        onMount: () => null,
        onEditConfig: () => null,
        onSelectConfig: null,
        onDeleteConfig: () => null,
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

    getConfigsByIdFromProps = createSelector(
        props => _.get(props, 'kqiData', []),
        configs => configs.reduce((byId, cfg) => ({ ...byId, [cfg.id]: cfg }), {}),
    );

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

    onEditConfig = (id) => {
        this.props.history.push(`/kqi/configure/${id}`);
    };

    render() {
        const { params = {} } = this.props.match;
        const { action, resultId, projectionId, configId } = params;
        const isConfiguratorActive = action === 'configure';
        const isCalculatorActive = action === 'calculate';
        const isResultsViewerActive = !_.isEmpty(configId) && !_.isEmpty(projectionId) && !_.isEmpty(resultId);
        const cfgName = configId ? _.get(this.getConfigsByIdFromProps(this.props), `${configId}.name`, '') : '';

        return (
            <div className={styles.kqiWrapper}>
                <div className={classnames(styles.kqiColumn, styles.configsTableContainer)}>
                    <Panel
                        title={ls('KQI_SYSTEM_TITLE', 'Система')}
                        bodyStyle={panelBodyStyle}
                    >
                        <ConfigsControls onSearchTextChange={this.onConfigsSearchTextChange}/>
                        <ConfigsTable
                            data={this.props.kqiData}
                            searchText={this.state.configsSearchText}
                            preloader={this.props.isConfigsLoading}
                            onSelectConfig={this.props.onSelectConfig}
                            onEditConfig={this.onEditConfig}
                            onDeleteConfig={this.props.onDeleteConfig}
                        />
                    </Panel>
                </div>
                <div className={classnames(styles.kqiColumn, styles.calculationsTableContainer)}>
                    <Panel
                        title={`${ls('KQI_PROJECTIONS_TITLE', 'Проекции')} ${cfgName}`}
                        bodyStyle={{ padding: 0 }}
                    >
                        <ProjectionsControls onSearchTextChange={this.onCalculationsSearchTextChange}/>
                        <ProjectionsTable
                            data={this.props.projectionsData}
                            searchText={this.state.calculationsSearchText}
                            preloader={this.props.isProjectionsLoading}
                            configId={configId}
                        />
                    </Panel>
                </div>
                {isConfiguratorActive && <Configurator active={isConfiguratorActive} configId={configId}/>}
                {isCalculatorActive && <Calculator active={isCalculatorActive} projectionId={projectionId}/>}
                {isResultsViewerActive && <ResultsViewer active={isResultsViewerActive}
                                                         projectionId={projectionId}
                                                         resultId={resultId}
                                                         configId={configId}
                                                         onClose={this.onResultsViewerClose}
                />}
            </div>
        );
    }

}

export default KQI;
