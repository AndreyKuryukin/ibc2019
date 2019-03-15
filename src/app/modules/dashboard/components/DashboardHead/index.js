import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {Collapse, Button, ButtonGroup as ReactstrapButtonGroup} from 'reactstrap';
import styles from './styles.scss';
import ButtonGroup from './ButtonGroup';
import Filters from './Filters';
import ls from '../../../../../i18n';
import {REGULARITIES, VIEW_MODE, DEFAULT_PATH_PARAMETERS} from '../../constants';
import LocationDropdown from './LocationDropdown';

const filterButtonStyle = {
    marginLeft: 40,
};

class DashboardHead extends React.Component {
    static propTypes = {
        viewMode: PropTypes.string,
        mrfId: PropTypes.string,
        className: PropTypes.string,
        regularity: PropTypes.string.isRequired,
        isFiltersExpanded: PropTypes.bool,
        filters: PropTypes.array,
        filterValues: PropTypes.object,
        locations: PropTypes.array.isRequired,
        buildLink: PropTypes.func.isRequired,
        onFiltersButtonClick: PropTypes.func.isRequired,
        onFilterChange: PropTypes.func.isRequired,
    };

    static localizeRegularity(regularity) {
        switch (regularity) {
            case REGULARITIES.HOUR:
                return ls('HOUR', 'Час');
            case REGULARITIES.DAY:
                return ls('DAY', 'Сутки');
            case REGULARITIES.WEEK:
                return ls('WEEK', 'Неделя');
            default:
                return regularity;
        }
    }
    static localizeViewMode(id) {
        switch (id) {
            case VIEW_MODE.GRAPH:
                return ls('DASHBOARD_VIEWMODE_GRAPH', 'Графики');
            case VIEW_MODE.MAP:
                return ls('DASHBOARD_VIEWMODE_MAP', 'Карта');
            default:
                return '';
        }
    }

    onFiltersButtonClick = () => {
        this.props.onFiltersButtonClick(!this.props.isFiltersExpanded);
    };

    getModeSwitcherOptions() {
        return Object.values(VIEW_MODE).map(mode => ({
            id: mode,
            text: DashboardHead.localizeViewMode(mode),
            value: mode,
            icon: mode,
            href: this.props.buildLink(
                mode === VIEW_MODE.MAP ? {
                    mode,
                    mrfId: DEFAULT_PATH_PARAMETERS.mapMrfId,
                } : {
                    mode,
                    mrfId: DEFAULT_PATH_PARAMETERS.graphMrfId,
                    type: null,
                },
            ),
        }));
    }
    getRegularityOptions() {
        return Object.values(REGULARITIES).map(regularity => ({
            id: regularity,
            text: DashboardHead.localizeRegularity(regularity),
            value: regularity,
            href: this.props.buildLink({ regularity }),
        }));
    }

    render() {
        return (
            <div className={cn(styles.dashboardHead, this.props.className)}>
                <ButtonGroup
                    className={styles.modeSwitcher}
                    value={this.props.viewMode}
                    options={this.getModeSwitcherOptions()}
                    color="primary"
                />
                {/*{this.props.viewMode !== VIEW_MODE.MAP && (*/}
                    {/*<LocationDropdown*/}
                        {/*className={styles.locationDropdown}*/}
                        {/*mrfId={this.props.mrfId}*/}
                        {/*locations={this.props.locations}*/}
                        {/*buildLink={this.props.buildLink}*/}
                    {/*/>*/}
                {/*)}*/}
                {/*<ButtonGroup*/}
                    {/*className={styles.regularitySwitcher}*/}
                    {/*value={this.props.regularity}*/}
                    {/*options={this.getRegularityOptions()}*/}
                {/*/>*/}
                <ReactstrapButtonGroup>
                    <Button
                        itemId="dashboard_filter_button"
                        color={this.props.isFiltersExpanded ? 'primary' : 'secondary'}
                        className="dropdown-toggle icon-btn dashboard-filter-icon"
                        style={filterButtonStyle}
                        outline={!this.props.isFiltersExpanded}
                        onClick={this.onFiltersButtonClick}
                        aria-expanded={this.props.isFiltersExpanded}
                    >{ls('FILTERS', 'Фильтры')}</Button>
                </ReactstrapButtonGroup>
                <Collapse
                    className={styles.filtersCollapse}
                    isOpen={this.props.isFiltersExpanded}
                >
                    <Filters
                        className={styles.filters}
                        list={this.props.filters}
                        values={this.props.filterValues}
                        onChange={this.props.onFilterChange}
                    />
                </Collapse>
            </div>
        );
    }
}

export default DashboardHead;
