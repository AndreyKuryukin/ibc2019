import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KQIComponent from '../components';
import ls from 'i18n';
import rest from '../../../rest';
import { fetchListOfKQIResultsSuccess } from '../actions';

class KQI extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        kqiData: PropTypes.array,
        onFetchKQISuccess: PropTypes.func,
    };

    static defaultProps = {
        kqiData: [],
        onFetchKQISuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle(ls('KQI_PAGE_TITLE', 'Результат вычисления KQI'));
    }

    onFetchKQI = () => {
        // this.setState({ isLoading: true });
        // rest.get('/api/v1/kqi')
        //     .then((response) => {
        //         const kqi = response.data;
        //         this.props.onFetchKQISuccess(kqi);
        //         this.setState({ isLoading: false });
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //         this.setState({ isLoading: false });
        //     });
    };

    render() {
        return (
            <KQIComponent
                match={this.props.match}
                history={this.props.history}
                kqiData={this.props.kqiData}
                onMount={this.onFetchKQI}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    kqiData: [],
});

const mapDispatchToProps = dispatch => ({
    onFetchKQISuccess: kqi => dispatch(fetchListOfKQIResultsSuccess(kqi)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(KQI);