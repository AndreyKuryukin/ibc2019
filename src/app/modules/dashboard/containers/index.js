import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ls from 'i18n';
import DashboardCmp from '../components/index';
import {REGULARITIES, VIEW_MODE, DEFAULT_PATH_PARAMETERS} from '../constants';
import {extractRegionName} from '../components/utils';
import rest from '../../../rest';

class Dashboard extends React.PureComponent {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                mode: PropTypes.string,
                regularity: PropTypes.string,
                type: PropTypes.string,
                mrfId: PropTypes.string,
            }).isRequired,
        }).isRequired,
    };
    static contextTypes = {
        navBar: PropTypes.object.isRequired,
    };

    state = {
        aggregated: null,
        locations: [],
    };

    componentDidMount() {
        this.context.navBar.setPageTitle([ls('DASHBOARD_PAGE_TITLE', 'Рабочий стол')]);
        this.fetchAggregated();
        this.fetchLocations();
    }

    componentWillReceiveProps(nextProps) {
        const actualRegularity = this.getRegularity();
        const nextRegularity = this.getRegularity(nextProps);

        if (actualRegularity !== nextRegularity) {
            this.fetchAggregated(nextRegularity);
        }
    }

    getRegularity(props = this.props) {
        return props.match.params.regularity || DEFAULT_PATH_PARAMETERS.regularity;
    }
    getMode(props = this.props) {
        return props.match.params.mode || DEFAULT_PATH_PARAMETERS.mode;
    }
    getType(props = this.props) {
        if (props.match.params.type !== undefined) return props.match.params.type;

        const { aggregated } = this.state;
        if (aggregated === null) return DEFAULT_PATH_PARAMETERS.type;

        const keys = Object.keys(aggregated);

        if (keys.length === 0) return DEFAULT_PATH_PARAMETERS.type;

        return keys[0];
    }
    getMRF(props = this.props) {
        const defaultMrfId = this.getMode() === VIEW_MODE.MAP
            ? DEFAULT_PATH_PARAMETERS.mapMrfId
            : DEFAULT_PATH_PARAMETERS.graphMrfId;
        return props.match.params.mrfId || defaultMrfId;
    }

    fetchAggregated(regularity = this.getRegularity()) {
        const queryParams = { regularity };

        rest.get('/api/v1/dashboard/head', {}, { queryParams })
            .then(({ data }) => {
                this.setState({
                    aggregated: data,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchLocations() {
        rest.get('/api/v1/common/location')
            .then(({ data }) => {
                this.setState({
                    locations: data,
                });
            })
            .catch(console.error);
    }

    render () {
        return (
            <DashboardCmp
                history={this.props.history}
                match={this.props.match}
                regularity={this.getRegularity()}
                mode={this.getMode()}
                type={this.getType()}
                mrfId={this.getMRF()}
                aggregated={this.state.aggregated}
                locations={this.state.locations.map(location => ({
                    ...location,
                    name: extractRegionName(location.name),
                }))}
            />
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
