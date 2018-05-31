import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { fetchMrfSuccess } from '../actions';
import rest from '../../../rest';
import AlarmsCmp from "../components/index";

class Alarms extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            history: this.props.history,
            match: this.props.match,
            location: this.props.location,
        };
    }

    componentDidMount() {
        rest.get('/api/v1/common/location')
            .then((response) => {
                const mrf = response.data;
                this.props.onFetchLocationsSuccess(mrf);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    render () {
        return (
            <AlarmsCmp
                history={this.props.history}
                match={this.props.match}
            />
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({
    onFetchLocationsSuccess: mrf => dispatch(fetchMrfSuccess(mrf)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alarms);
