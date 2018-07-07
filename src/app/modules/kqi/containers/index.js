import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KQIComponent from '../components';
import ls from 'i18n';
import rest from '../../../rest';
import { fetchKQIConfigsSuccess, fetchKQIProjectionsSuccess, deleteKqiConfigSuccess } from '../actions';
import _ from "lodash";

class KQI extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        fetchKqi: PropTypes.func.isRequired
    };

    getChildContext = () => ({
        fetchKqi: this.onFetchKQI
    });

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        kqiData: PropTypes.array,
        projectionsData: PropTypes.array,
        onFetchKQISuccess: PropTypes.func,
        onFetchProjectionsSuccess: PropTypes.func,
        onDeleteKqiConfigSuccess: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        projectionsData: [],
        onFetchKQISuccess: () => null,
        onFetchProjectionsSuccess: () => null,
        onDeleteKqiConfigSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isConfigsLoading: false,
            isProjectionsLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('KQI_PAGE_TITLE', 'KQI'));
        this.onFetchKQI();
    }

    componentWillReceiveProps(nextProps) {
        const params = _.get(nextProps, 'match.params', {});
        const path = _.get(nextProps, 'match.url', '');
        const previousPath = _.get(this.props, 'match.url', '');
        if (previousPath !== path && path === '/kqi' ) {
            this.onFetchKQI();
        }
        if (params.configId !== this.state.configId) {
            this.setState({ configId: params.configId });
            this.onSelectConfig(params.configId);
        }
    }

    componentWillUnmount() {
        this.props.onFetchProjectionsSuccess([]);
    }

    onDeleteConfig = (id) => {
        this.setState({ isConfigsLoading: true });
        if (id) {
            const urlParams = { kqiId: id };
            rest.delete('/api/v1/kqi/:kqiId', {}, { urlParams })
                .then(() => {
                    this.props.onDeleteKqiConfigSuccess(id);
                    this.setState({ isConfigsLoading: false });
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isConfigsLoading: false });
                });
        }
    };

    onFetchKQI = () => {
        this.setState({ isConfigsLoading: true });
        rest.get('/api/v1/kqi')
            .then((response) => {
                const kqiConfigs = response.data;
                this.setState({ isConfigsLoading: false, kqiConfigs });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isConfigsLoading: false });
            });
    };

    onSelectConfig = (configId) => {
        if (configId && this.state.configId !== configId) {
            this.setState({ isProjectionsLoading: true, configId });

            const urlParams = {
                kqiId: configId,
            };
            rest.get('/api/v1/kqi/:kqiId/projection', { urlParams })
                .then((response) => {
                    const projections = response.data;
                    this.props.history.push(`/kqi/view/${configId}`);
                    this.setState({ isProjectionsLoading: false, projections });
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isProjectionsLoading: false });
                });
        }

    };

    render() {
        return (
            <KQIComponent
                match={this.props.match}
                history={this.props.history}
                kqiData={this.state.kqiConfigs}
                projectionsData={this.state.projections}
                isConfigsLoading={this.state.isConfigsLoading}
                isProjectionsLoading={this.state.isProjectionsLoading}
                onSelectConfig={this.onSelectConfig}
                onDeleteConfig={this.onDeleteConfig}
            />
        );
    }
}

const mapStateToProps = state => ({
    kqiData: state.kqi.kqi.configs,
    projectionsData: state.kqi.kqi.projections,
});

const mapDispatchToProps = dispatch => ({
    onFetchKQISuccess: kqi => dispatch(fetchKQIConfigsSuccess(kqi)),
    onFetchProjectionsSuccess: projections => dispatch(fetchKQIProjectionsSuccess(projections)),
    onDeleteKqiConfigSuccess: id => dispatch(deleteKqiConfigSuccess(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KQI);