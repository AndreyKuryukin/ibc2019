import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'qreact';
import RolesListTable from './RolesListTable';
import RolesListControls from './RolesListControls';

const mapStateToProps = () => ({
    controls: (
        <RolesListControls />
    ),
    table: (
        <RolesListTable />
    ),
});

const RolesListGrid = connect(
    mapStateToProps,
)(Grid);

export default RolesListGrid;
