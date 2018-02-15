import React from 'react';
import { connect } from 'react-redux';
import Grid from '../components/RolesGrid';
import { fetchListOfRoles } from '../actions';

const mapDispatchToProps = dispatch => ({
    onMount: () => {
        fetchListOfRoles(dispatch, 'username');
    }
});

const RolesGrid = connect(
    null,
    mapDispatchToProps,
)(Grid);

export default RolesGrid;
