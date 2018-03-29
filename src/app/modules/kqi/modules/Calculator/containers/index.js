import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CalculatorComponent from '../components';
import rest from '../../../../../rest';
import {
    fetchListsSuccess,
} from '../actions';

class Calculator extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        pageBlur: PropTypes.func.isRequired
    };

    static propTypes = {
        active: PropTypes.bool,
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
        this.setState({ isLoading: true });

        Promise.all([
            rest.get('/api/v1/kqi'),
            rest.get('/api/v1/kqi/location/prefix'),
            rest.get('/api/v1/kqi/manufacture/prefix'),
            rest.get('/api/v1/kqi/equipment/prefix'),
            rest.get('/api/v1/kqi/usergroup/prefix'),
        ]).then(([
            kqiResponse,
            locationResponse,
            manufactureResponse,
            equipmentResponse,
            usergroupResponse,
        ]) => {
            this.props.onFetchListsSuccess({
                kqi: kqiResponse.data,
                locations: locationResponse.data,
                manufactures: manufactureResponse.data,
                equipments: equipmentResponse.data,
                usergroups: usergroupResponse.data,
            });

            this.setState({ isLoading: false });
        }).catch((e) => {
            console.error(e);
            this.setState({ isLoading: false });
        });
    };

    onSubmitKQI = (kqi) => {
        this.setState({ isLoading: true });
        console.log(kqi);
        rest.post('/api/v1/kqi/calculate', kqi)
            .then((response) => {
                const kqi = response.data;
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
            <CalculatorComponent
                active={this.props.active}
                kqiList={this.props.kqiList}
                locationsList={this.props.locationsList}
                manufactureList={this.props.manufactureList}
                equipmentsList={this.props.equipmentsList}
                usergroupsList={this.props.usergroupsList}
                onSubmit={this.onSubmitKQI}
                onMount={this.onMount}
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
});

const mapDispatchToProps = dispatch => ({
    onFetchListsSuccess: lists => dispatch(fetchListsSuccess(lists)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calculator);