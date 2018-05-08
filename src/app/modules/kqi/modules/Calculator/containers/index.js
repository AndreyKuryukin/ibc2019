import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import CalculatorComponent from '../components';
import rest from '../../../../../rest';
import { fetchListsSuccess, fetchProjectionSuccess } from '../actions';
import { validateForm } from '../../../../../util/validation';

class Calculator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
        projectionId: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
        projection: PropTypes.object,
        kqiList: PropTypes.array,
        manufactureList: PropTypes.array,
        onFetchListsSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        kqiList: [],
        locationsList: [],
        manufactureList: [],
        equipmentsList: [],
        usergroupsList: [],
        onFetchListsSuccess: () => null,
    };

    validationConfig = {
        name: {
            required: true,
        },
        kqi_id: {
            required: true,
        },
        period: () => ({
            start_date: {
                required: true,
            },
            end_date: {
                required: true,
            }
        }),
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errors: null,
        };
    }

    componentDidMount() {
        this.context.pageBlur && this.context.pageBlur(true);
        this.loadData();
    }

    loadData = () => {
        const { projectionId } = this.props;
        const requests = [
            rest.get('/api/v1/kqi'),
            rest.get('/api/v1/common/location'),
            rest.get('/api/v1/common/manufacture'),
            rest.get('/api/v1/common/equipment'),
            rest.get('/api/v1/common/usergroup'),
        ];
        if (!_.isUndefined(projectionId)) {
            requests.push(rest.get('/api/v1/kqi/projection/:projectionId', { urlParams: { projectionId } }));
        }
        this.setState({ isLoading: true });

        Promise.all(requests).then(([
                                        kqiResponse,
                                        locationResponse,
                                        manufactureResponse,
                                        equipmentResponse,
                                        usergroupResponse,
                                        projectionResponse
                                    ]) => {
            this.props.onFetchListsSuccess({
                kqi: kqiResponse.data,
                locations: locationResponse.data,
                manufactures: manufactureResponse.data,
                equipments: equipmentResponse.data,
                usergroups: usergroupResponse.data,
            });

            if (projectionResponse) {
                const projection = projectionResponse.data;
                this.props.onFetchProjectionSuccess(projection);
            }
            this.setState({ isLoading: false });
        }).catch((e) => {
            console.error(e);
            this.setState({ isLoading: false });
        });
    };

    onSubmitKQI = (projection) => {
        const errors = validateForm(projection, this.validationConfig);
        if (_.isEmpty(errors)) {
            this.setState({ isLoading: true });
            const projectionDTO = _.reduce(projection, (result, value, key) => {
                if (!_.isEmpty(value)) {
                    result[key] = value;
                }
                return result
            }, {});
            rest.post('/api/v1/kqi/projection', projectionDTO)
                .then((response) => {
                    const kqi = response.data;
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
        const { projection, projectionId } = this.props;
        return (
            <CalculatorComponent
                active={this.props.active}
                kqiList={this.props.kqiList}
                locationsList={this.props.locationsList}
                manufactureList={this.props.manufactureList}
                equipmentsList={this.props.equipmentsList}
                usergroupsList={this.props.usergroupsList}
                onSubmit={this.onSubmitKQI}
                onMount={this.onMount}
                errors={this.state.errors}
                config={_.isUndefined(projectionId) ? null : projection}
            />
        );
    }
}

const mapStateToProps = state => ({
    kqiList: state.kqi.calculator.lists.kqi,
    locationsList: state.kqi.calculator.lists.locations,
    manufactureList: state.kqi.calculator.lists.manufactures,
    equipmentsList: state.kqi.calculator.lists.equipments,
    usergroupsList: state.kqi.calculator.lists.usergroups,
    projection: _.get(state, 'kqi.calculator.projection'),
});

const mapDispatchToProps = dispatch => ({
    onFetchListsSuccess: lists => dispatch(fetchListsSuccess(lists)),
    onFetchProjectionSuccess: pojection => dispatch(fetchProjectionSuccess(pojection)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);