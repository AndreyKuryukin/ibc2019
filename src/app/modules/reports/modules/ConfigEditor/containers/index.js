import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ConfigEditorComponent from '../components';
import { fetchUsersSuccess } from '../actions';
import rest from '../../../../../rest';

class ConfigEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        active: PropTypes.bool,
        users: PropTypes.array,
        onFetchUsersSuccess: PropTypes.func,
    };

    static defaultProps = {
        active: false,
        users: [],
        onFetchUsersSuccess: () => null,
    };

    onMount = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/user')
            .then((response) => {
                const users = response.data;

                this.props.onFetchUsersSuccess(users);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onSubmit = (config) => {
        this.setState({ isLoading: true });

        rest.post('/api/v1/reports/configs', config)
            .then((response) => {
                const newConfig = response.data;
                console.log(newConfig);

                this.setState({ isLoading: false });
                this.context.history.push('/reports');
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <ConfigEditorComponent
                active={this.props.active}
                users={this.props.users}
                onMount={this.onMount}
                onSubmit={this.onSubmit}
            />
        )
    }
}

const mapStateToProps = state => ({
    users: state.reports.editor.users,
});

const mapDispatchToProps = dispatch => ({
    onFetchUsersSuccess: users => dispatch(fetchUsersSuccess(users)),
    onSubmitConfigSuccess: config => null,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConfigEditor);