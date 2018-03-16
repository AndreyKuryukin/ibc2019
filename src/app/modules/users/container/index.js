import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UsersComponent from '../components/';
import rest from '../../../rest';
import { fetchUsersSuccess, deleteUserSuccess, fetchDivisionsSuccess } from '../actions';
import { selectUsersData } from '../selectors';

class Users extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        usersData: PropTypes.array,
        divisionsById: PropTypes.object,
        onFetchUsersSuccess: PropTypes.func,
        onFetchDivisionsSuccess: PropTypes.func,
        onDeleteUsersSuccess: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        divisionsById: null,
        onFetchUsersSuccess: () => null,
        onFetchDivisionsSuccess: () => null,
        onDeleteUsersSuccess: () => null,
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

        Promise.all([rest.get('/api/v1/user/all'), rest.get('/api/v1/division/root')])
            .then(([usersResponse, divisionsResponse]) => {
                const users = usersResponse.data;
                const divisions = divisionsResponse.data;
                this.props.onFetchUsersSuccess(users);
                this.props.onFetchDivisionsSuccess(divisions);
                this.setState({ isLoading: false });
            });
    }

    onDelete = (ids) => {
        this.setState({
            isLoading: true,
        });

        Promise.all(
            ids.map(id => rest.delete('/api/v1/user/:userId', {}, { urlParams: { userId: id } }))
        ).then(() => {
            this.props.onDeleteUsersSuccess(ids);
            this.setState({ isLoading: false });
        }).catch((e) => {
            console.error(e);
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
                divisionsById={this.props.divisionsById}
                onMount={this.onUsersMount}
                onDelete={this.onDelete}
            />
        );
    }
}

const mapStateToProps = state => ({
    usersData: selectUsersData(state),
    divisionsById: state.users.users.divisionsById,
});

const mapDispatchToProps = dispatch => ({
    onFetchUsersSuccess: (users) => dispatch(fetchUsersSuccess(users)),
    onFetchDivisionsSuccess: (divisions) => dispatch(fetchDivisionsSuccess(divisions)),
    onDeleteUsersSuccess: (ids) => dispatch(deleteUserSuccess(ids)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Users);
