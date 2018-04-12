import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KQIComponent from '../components';
import ls from 'i18n';
import rest from '../../../rest';
import {
    fetchKQIConfigsSuccess,
    fetchKQIProjectionsSuccess,
} from '../actions';

class KQI extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        kqiData: PropTypes.array,
        projectionsData: PropTypes.array,
        onFetchKQISuccess: PropTypes.func,
        onFetchProjectionsSuccess: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        projectionsData: [],
        onFetchKQISuccess: () => null,
        onFetchProjectionsSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isConfigsLoading: false,
            isProjectionsLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('KQI_PAGE_TITLE', 'Результат вычисления KQI'));
    }

    onFetchKQI = () => {
        this.setState({ isConfigsLoading: true });
        rest.get('/api/v1/kqi')
            .then((response) => {
                const kqi = response.data;
                this.props.onFetchKQISuccess(kqi);
                this.setState({ isConfigsLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isConfigsLoading: false });
            });
    };

    onSelectConfig = (kqiId) => {
        this.setState({ isProjectionsLoading: true });

        const urlParams = {
            kqiId,
        };
        rest.get('/api/v1/kqi/:kqiId/projection', { urlParams })
            .then((response) => {
                const projections = response.data;
                this.props.onFetchProjectionsSuccess(projections);
                this.props.history.push(`/kqi/view/${kqiId}`);
                this.setState({ isProjectionsLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isProjectionsLoading: false });
            });
    };

    render() {
        return (
            <KQIComponent
                match={this.props.match}
                history={this.props.history}
                kqiData={this.props.kqiData}
                projectionsData={this.props.projectionsData}
                onMount={this.onFetchKQI}
                isConfigsLoading={this.state.isConfigsLoading}
                isProjectionsLoading={this.state.isProjectionsLoading}
                onSelectConfig={this.onSelectConfig}
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KQI);