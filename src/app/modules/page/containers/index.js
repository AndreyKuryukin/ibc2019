import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PageWrapper from '../../../components/PageWrapper'
import { submitCiNotifications, submitGpNotifications, submitKqiNotifications } from "../actions/index";
import { withRouter } from "react-router";
import { CI_ALERT_TYPE, GROUP_POLICIES_ALERT_TYPE, KQI_ALERT_TYPE } from "../../alerts/constants";

const mapStateToProps = state => ({
    user: state.user,
    app: state.app,
    notifications: _.get(state, 'notifications')
});

const ACTION_MAP = {
    SUBMIT_NOTIFICATIONS: {
        [CI_ALERT_TYPE]: submitCiNotifications,
        [GROUP_POLICIES_ALERT_TYPE]: submitGpNotifications,
        [KQI_ALERT_TYPE]: submitKqiNotifications
    }
};

const mapDispatchToProps = dispatch => ({
    onNotificationClick: (type, notifications) => dispatch(ACTION_MAP.SUBMIT_NOTIFICATIONS[type](notifications))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageWrapper));
