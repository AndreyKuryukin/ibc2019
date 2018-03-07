import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UsersComponent from '../components/';
import rest from '../../../rest';
import { fetchUsersSuccess, deleteUserSuccess } from '../actions';
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

    onDelete = (ids) => {
        this.setState({
            isLoading: true,
        });

        Promise.all(
            ids.map(id => rest.delete('/api/v1/user/:userId', {}, { urlParams: { userId: id } }))
        ).then(([...ids]) => {
            this.props.deleteUserSuccess(ids);
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
                onMount={this.onUsersMount}
                onDelete={this.onDelete}
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
