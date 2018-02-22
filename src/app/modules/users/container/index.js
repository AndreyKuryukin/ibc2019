import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UsersComponent from '../components/';
import rest from '../../../rest';
import { fetchUsersSuccess } from '../actions';
import { selectUsersData } from '../selectors';

class Users extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        usersData: PropTypes.array,
        onFetchUsersSuccess: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        onFetchUsersSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle('Пользователи');
    }

    onUsersMount = () => {
        this.setState({ isLoading: true });

        rest.get('/api/v1/user/all')
            .then((response) => {
                const users = response.data;
                this.props.onFetchUsersSuccess(users);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <UsersComponent
                history={this.props.history}
                match={this.props.match}
                isLoading={this.state.isLoading}
                usersData={this.props.usersData}
                onMount={this.onUsersMount}
            />
        );
    }
}

const mapStateToProps = state => ({
    usersData: selectUsersData(state),
});

const mapDispatchToProps = dispatch => ({
    onFetchUsersSuccess: (users) => dispatch(fetchUsersSuccess(users)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Users);
