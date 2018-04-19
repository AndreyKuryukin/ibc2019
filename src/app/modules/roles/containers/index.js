import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteRoleSuccess, fetchListOfRolesSuccess } from '../actions';
import rest from '../../../rest';
import { selectRolesData } from '../selectors';
import RolesComponent from '../components';
import ls from "i18n";

class Roles extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
        notifications: PropTypes.object.isRequired,
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
        this.context.navBar.setPageTitle(ls('ROLES_PAGE_TITLE', 'Роли'));
    }

    fetchRoles = () => {
        this.setState({ isLoading: true });
        rest.get('/api/v1/role/')
            .then((response) => {
                const roles = response.data;
                this.props.onFetchRolesSuccess(roles);
                this.setState({ isLoading: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onRemoveConfirmed = (ids) => {
        this.setState({ isLoading: true });
        Promise.all(
            ids.map(id => rest.delete('/api/v1/role/:roleId', {}, { urlParams: { roleId: id } }))
        ).then(([...deletedIds]) => {
            this.props.onDeleteRolesSuccess(ids);
            this.setState({ isLoading: false });
        })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoading: false });
            });
    };

    onRemove = (ids) => {
        this.onRemoveConfirmed(ids)
    };

    render() {
        return (
            <RolesComponent
                match={this.props.match}
                history={this.props.history}
                rolesData={this.props.rolesData}
                onMount={this.fetchRoles}
                onRemove={this.onRemove}
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
