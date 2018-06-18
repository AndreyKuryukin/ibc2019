import React from 'react';
import PropTypes from 'prop-types';
import DashboardHead from './DashboardHead';
import DashboardTabs from './DashboardTabs';
import styles from './styles.scss';
import {VIEW_MODE, FILTERS, REGULARITIES} from '../constants';
import Graph from './Graph';
import Map from './Map';


const aggregatedItemPT = PropTypes.shape({
    current: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['NaN'])
    ]),
    previous: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['NaN'])
    ]),
    plan: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['NaN'])
    ]),
});

class Dashboard extends React.PureComponent {
    static propTypes = {
        regularity: PropTypes.string.isRequired,
        mode: PropTypes.string.isRequired,
        type: PropTypes.string,
        mrfId: PropTypes.string,
        aggregated: PropTypes.shape({
            KAB: aggregatedItemPT,
            KGS: aggregatedItemPT,
            KSPD: aggregatedItemPT,
        }),
        locations: PropTypes.array,
    };

    state = {
        aggregated: null,
        isFiltersExpanded: false,
        filter: FILTERS.reduce((result, filter) => ({
            ...result,
            [filter.id]: filter.options.filter(option => option.enabled).map(option => option.value),
        }), {}),
    };

    buildLink = ({
        regularity = this.props.regularity,
        mode = this.props.mode,
        type = this.props.type,
        mrfId = this.props.mrfId,
    }) => {
        // /dashboard/:regularity/:mode/:type/:mrfId

        const parts = ['/dashboard'];

        const values = [regularity, mode, type, mrfId];

        for (const value of values) {
            if (value === undefined || value === null) break;

            parts.push(value);
        }

        return parts.join('/');
    };

    onFiltersButtonClick = (isFiltersExpanded) => this.setState({ isFiltersExpanded });
    onFilterChange = (filter) => this.setState({ filter });

    mapAggregatedToTabs() {
        const { aggregated } = this.props;

        if (aggregated === null) return [];

        return Object.entries(aggregated).map(([id, item]) => ({
            id,
            type: id,
            href: this.buildLink({ type: id }),
            value: item.current === 'NaN' ? undefined : item.current,
            previous: item.previous === 'NaN' ? undefined : item.previous,
            expected: item.plan === 'NaN' ? undefined : item.plan,
        }));
    }

    render() {
        const { match, locations } = this.props;
        const { aggregated } = this.props;
        const { params = {} } = match;

        const {
            regularity,
            type,
            mode,
            mrfId,
        } = this.props;

        if (type === undefined) return null;

        const plan = aggregated === null || aggregated[type] === undefined || aggregated[type].plan === 'NaN'
            ? null
            : aggregated[type].plan;

        const filter = {
            type,
            regularity,
            ...this.state.filter,
        };

        return <div className={styles.dashboardPage}>
            <DashboardHead
                viewMode={mode}
                mrfId={mrfId}
                className={styles.head}
                regularity={regularity}
                isFiltersExpanded={this.state.isFiltersExpanded}
                filters={FILTERS}
                filterValues={this.state.filter}
                locations={locations}
                buildLink={this.buildLink}
                onFiltersButtonClick={this.onFiltersButtonClick}
                onFilterChange={this.onFilterChange}
            />
            <DashboardTabs
                className={styles.tabs}
                tabs={this.mapAggregatedToTabs()}
                selectedTabId={type}
                enableLinks={mode === VIEW_MODE.MAP}
            />
            <div className={styles.widgets}>
                {mode === VIEW_MODE.GRAPH ? (
                    <Graph
                        regularity={regularity}
                        mrfId={mrfId}
                    />
                ) : (
                    <Map
                        mrfId={mrfId}
                        type={type}
                        plan={plan}
                        buildLink={this.buildLink}
                        filter={filter}
                    />
                )}
            </div>
        </div>
    }
}

export default Dashboard;
