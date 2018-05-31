import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CIComponent from '../components';
import ls from "i18n";

class ClientsIncidents extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('ALARMS_PAGE_TITLE', 'Аварии'), ls('ALARMS_CLIENTS_INCIDENTS_PAGE_TITLE', 'Клиентские инциденты')]);
    }

    render() {
        return (
            <CIComponent />
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientsIncidents);