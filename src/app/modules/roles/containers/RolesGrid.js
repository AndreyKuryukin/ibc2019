import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridComponent from '../components/RolesGrid';
import { fetchListOfRolesSuccess, deleteRoleSuccess } from '../actions';
import rest from '../../../rest';

class Grid extends React.PureComponent {
    static propTypes = {
        onFetchRolesSuccess: PropTypes.func,
        onDeleteRolesSuccess: PropTypes.func,
    };

    static defaultProps = {
        onFetchRolesSuccess: () => null,
        onDeleteRolesSuccess: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    onChildMount = () => {
        this.setState({ isLoading: true });
        const urlParams = {
            login: 'username',
        };

        rest.get('/api/v1/role/user/:login', { urlParams })
            .then((response) => {
                const roles = response.data;
                this.props.onFetchRolesSuccess(roles);
                this.setState({ isLoading: false });
            });
    }

    onDeleteRoles = (ids) => {
        this.setState({ isLoading: true });
        const data = { ids };

        rest.delete('/api/v1/role', data)
            .then(() => {
                this.props.onDeleteRolesSuccess(ids);
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <GridComponent
                isLoading={this.state.isLoading}
                onMount={this.onChildMount}
                onDelete={this.onDeleteRoles}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onFetchRolesSuccess: roles => dispatch(fetchListOfRolesSuccess(roles)),
    onDeleteRolesSuccess: ids => dispatch(deleteRoleSuccess(ids)),
});

const RolesGrid = connect(
    null,
    mapDispatchToProps,
)(Grid);

export default RolesGrid;
