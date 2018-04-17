import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ConfiguratorComponent from '../components';
import rest from '../../../../../rest';
import { validateForm } from '../../../../../util/validation';
import { fetchConfigSuccess, fetchParameterTypesSuccess } from '../actions';

class Configurator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
        configId: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
        paramTypes: PropTypes.array,
        paramTypesById: PropTypes.object,
        config: PropTypes.object,
        onFetchParamTypesSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        paramTypes: [],
        paramTypesById: null,
        config: null,
        onFetchParamTypesSuccess: () => null,
        onFetchConfigSuccess: () => null,
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

    state = {
        errors: null,
    };

    validationConfig = {
        name: {
            required: true
        },
        ['kpi-object_type']: {
            required: true
        },
        operator: {
            required: true
        },
        kpi_parameter_type: {
            required: true
        },
        level: {
            required: true
        },
    };

    componentDidMount() {
        this.setState({ isLoading: true });
        const { configId } = this.props;

        const requests = [rest.get('/api/v1/common/parameters')];

        if (!_.isEmpty(configId)) {
            requests.push(rest.get('/api/v1/kqi/:configId', { urlParams: { configId } }));
        }

        Promise.all(requests)
            .then(([typesResponse, configResponse]) => {
                const parameterTypes = typesResponse.data;
                const config = configResponse && configResponse.data;
                this.props.onFetchParamTypesSuccess(parameterTypes);
                if (config) {
                    this.props.onFetchConfigSuccess(config);
                }
                this.setState({ isLoading: false })
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onSubmitKPI = (kpiConfig) => {
        const errors = validateForm(kpiConfig, this.validationConfig);

        if (_.isEmpty(errors)) {
            this.setState({ isLoading: true });

            rest.post('/api/v1/kqi', kpiConfig)
                .then((response) => {
                    this.setState({ isLoading: false });
                    this.context.history.push('/kqi');
                })
                .catch((e) => {
                    console.error(e);
                    this.setState({ isLoading: false });
                });
        } else {
            this.setState({ errors });
        }
    };

    render() {
        const { config, configId } = this.props;
        return (
            <ConfiguratorComponent
                isLoading={this.state.isLoading}
                active={this.props.active}
                config={_.isUndefined(configId) ? null : config}
                paramTypes={this.props.paramTypes}
                paramTypesById={this.props.paramTypesById}
                onSubmit={this.onSubmitKPI}
                errors={this.state.errors}
            />
        );
    }
}

const mapStateToProps = state => ({
    paramTypes: state.kqi.configurator.paramTypes,
    paramTypesById: state.kqi.configurator.paramTypesById,
    config: state.kqi.configurator.config,
});

const mapDispatchToProps = dispatch => ({
    onFetchParamTypesSuccess: paramTypes => dispatch(fetchParameterTypesSuccess(paramTypes)),
    onFetchConfigSuccess: config => dispatch(fetchConfigSuccess(config)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Configurator);
