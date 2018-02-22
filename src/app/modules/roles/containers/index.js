import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchListOfRolesSuccess, deleteRoleSuccess } from '../actions';
import rest from '../../../rest';
import { selectRolesData } from '../selectors';
import RolesComponent from '../components';

class Roles extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        rolesData: PropTypes.array,
        onFetchRolesSuccess: PropTypes.func,
        onDeleteRolesSuccess: PropTypes.func,
    };

    static defaultProps = {
        rolesData: [],
        onFetchRolesSuccess: () => null,
        onDeleteRolesSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        this.context.navBar.setPageTitle('Роли');
    }

    onRolesMount = () => {
        this.setState({ isLoading: true });
        const urlParams = {
            login: 'username',
        };

        rest.get('/api/v1/role/all', { urlParams })
            .then((response) => {
                const roles = response.data;
                this.props.onFetchRolesSuccess(roles);
                this.setState({ isLoading: false });
            });
    };

    onDeleteRoles = (ids) => {
        this.setState({ isLoading: true });

        rest.delete('/api/v1/role', { ids })
            .then(() => {
                this.props.onDeleteRolesSuccess(ids);
                this.setState({ isLoading: false });
            });
    };

    render() {
        return (
            <RolesComponent
                match={this.props.match}
                history={this.props.history}
                rolesData={this.props.rolesData}
                onMount={this.onRolesMount}
                onDeleteRoles={this.onDeleteRoles}
                isLoading={this.state.isLoading}
            />
        );
    }
}

const mapStateToProps = state => ({
    rolesData: selectRolesData(state),
});

const mapDispatchToProps = dispatch => ({
    onFetchRolesSuccess: roles => dispatch(fetchListOfRolesSuccess(roles)),
    onDeleteRolesSuccess: ids => dispatch(deleteRoleSuccess(ids)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Roles);
