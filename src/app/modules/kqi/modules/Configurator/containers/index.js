import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfiguratorComponent from '../components';
import rest from '../../../../../rest';
import { fetchParameterTypesSuccess } from '../actions';

class Configurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
        paramTypes: PropTypes.array,
        paramTypesById: PropTypes.object,
        onFetchParamTypesSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        paramTypes: [],
        paramTypesById: null,
        onFetchParamTypesSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.pageBlur && this.context.pageBlur(true);
    }

    onMount = () => {
        this.setState({isLoading: true});

        rest.get('/api/v1/kqi/parameterTypes')
            .then((response) => {
                const parameterTypes = response.data;
                this.props.onFetchParamTypesSuccess(parameterTypes);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onSubmitKPI = (kpiConfig) => {
        this.setState({ isLoading: true });

        rest.post('/api/v1/kqi', kpiConfig)
            .then((response) => {
                const kpi = response.data;
                this.setState({ isLoading: false });
                this.context.history.push('/kqi');
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    render() {
        return (
            <ConfiguratorComponent
                active={this.props.active}
                paramTypes={this.props.paramTypes}
                paramTypesById={this.props.paramTypesById}
                onMount={this.onMount}
                onSubmit={this.onSubmitKPI}
            />
        );
    }
}

const mapStateToProps = state => ({
    paramTypes: state.kqi.configurator.paramTypes,
    paramTypesById: state.kqi.configurator.paramTypesById,
});

const mapDispatchToProps = dispatch => ({
    onFetchParamTypesSuccess: paramTypes => dispatch(fetchParameterTypesSuccess(paramTypes)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Configurator);
