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

    static contextTypes = {
        hasAccess: PropTypes.func.isRequired,
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
        onDeleteConfig: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        projectionsData: [],
        isConfigsLoading: false,
        isProjectionsLoading: false,
        onMount: () => null,
        onSelectConfig: null,
        onDeleteConfig: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            configsSearchText: '',
            calculationsSearchText: '',
            selectedKQIConfigId: null,
        };
    }

    componentDidMount() {
        const configId = _.get(this.props, 'match.params.configId');
        configId && this.props.onSelectConfig(configId);
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

    onCloseCalculator = (configId) => {
        if (configId) {
            this.props.onSelectConfig(configId, () => {
                this.props.history.push(`/kqi/configure/${kqiId}`);
            });
        }
    }

    onResultsViewerClose = () => {
        const { params } = this.props.match;
        const configId = params.configId || this.state.selectedKQIConfigId;

        this.props.history.push(`/kqi/view/${configId}`);
    };

    onEditConfig = (id) => {
        this.props.history.push(`/kqi/configure/${id}`);
    };

    onSelectConfig = (kqiId) => {
        this.setState({
            selectedKQIConfigId: kqiId,
        }, () => {
            this.props.onSelectConfig(kqiId, () => {
                this.props.history.push(`/kqi/view/${kqiId}`);
            });
        });
    };

    onViewProjection = (id) => {
        const { params } = this.props.match;
        const configId = params.configId || this.state.selectedKQIConfigId;

        this.props.history.push(`/kqi/calculate/${configId}/${id}`);
    };

    render() {
        const { params = {} } = this.props.match;
        const { action, resultId, projectionId, configId: urlKqiId } = params;
        const configId = urlKqiId || this.state.selectedKQIConfigId;
        const isConfiguratorActive = this.context.hasAccess('KQI', 'EDIT') ? action === 'configure' : (action === 'configure' && urlKqiId);
        const isCalculatorActive = this.context.hasAccess('KQI', 'EDIT') && action === 'calculate';
        const isResultsViewerActive = !_.isEmpty(configId) && !_.isEmpty(projectionId) && !_.isEmpty(resultId);
        const cfgName = configId ? _.get(this.getConfigsByIdFromProps(this.props), `${configId}.name`, '') : '';
        return (
            <div className={styles.kqiWrapper}>
                <div className={classnames(styles.kqiColumn, styles.configsTableContainer)}>
                    <Panel
                        title={ls('KQI_CONFIGS_TITLE', 'Конфигурации KQI')}
                        bodyStyle={panelBodyStyle}
                    >
                        <ConfigsControls onSearchTextChange={this.onConfigsSearchTextChange}/>
                        <ConfigsTable
                            data={this.props.kqiData}
                            searchText={this.state.configsSearchText}
                            preloader={this.props.isConfigsLoading}
                            onSelectConfig={this.onSelectConfig}
                            onEditConfig={this.onEditConfig}
                            onDeleteConfig={this.props.onDeleteConfig}
                            selected={configId}
                        />
                    </Panel>
                </div>
                <div className={classnames(styles.kqiColumn, styles.calculationsTableContainer)}>
                    <Panel
                        title={`${ls('KQI_PROJECTIONS_TITLE', 'Проекции')} ${cfgName}`}
                        bodyStyle={panelBodyStyle}
                    >
                        <ProjectionsControls onSearchTextChange={this.onCalculationsSearchTextChange}/>
                        <ProjectionsTable
                            data={this.props.projectionsData}
                            searchText={this.state.calculationsSearchText}
                            preloader={this.props.isProjectionsLoading}
                            configId={configId}
                            onViewProjection={this.onViewProjection}
                        />
                    </Panel>
                </div>
                {isConfiguratorActive && <Configurator active={isConfiguratorActive} configId={urlKqiId}/>}
                {isCalculatorActive && <Calculator active={isCalculatorActive}
                                                   projectionId={projectionId}
                                                   onClose={this.onCloseCalculator}
                />}
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
