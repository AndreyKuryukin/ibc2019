import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'qreact';
import RolesControls from './RolesControls';
import RolesTable from './RolesTable';

const mapStateToProps = () => ({
    controls: (
        <RolesControls />
    ),
    table: (
        <RolesTable />
    ),
});

const RolesGrid = connect(
    mapStateToProps,
)(Grid);

export default RolesGrid;
