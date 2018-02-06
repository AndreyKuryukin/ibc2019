import React from 'react';
import { connect } from 'react-redux';

import LoginComponent from '../components';

const mapStateToProps = (state) => ({
    login: 'SuperAdmin',
    password: 'sa',
});

const mapDispatchToProps = dispatch => ({
    onSubmit: () => {}
});

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginComponent);

export default Login;
