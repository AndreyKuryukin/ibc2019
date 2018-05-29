import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import ls from "i18n";

import DasboardCmp from "../components/index";

class Dasboard extends React.PureComponent {
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('DASHBOARD_PAGE_TITLE', 'Рабочий стол')]);
    }

    render () {
        return (
            <DasboardCmp
                history={this.props.history}
                match={this.props.match}
            />
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dasboard);
