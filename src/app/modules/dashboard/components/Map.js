import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import WidgetWrapper from './WidgetWrapper';
import RussianMap from './RussianMap';
import rest from '../../../rest';
import KQI from './KQI';
import {extractRegionName} from './utils';

class Map extends React.Component {
    static propTypes = {
        mrfId: PropTypes.string,
        type: PropTypes.string.isRequired,
        buildLink: PropTypes.func.isRequired,
        plan: PropTypes.number,
        filter: PropTypes.shape({
            type: PropTypes.string.isRequired,
            service: PropTypes.arrayOf(PropTypes.string),
            product: PropTypes.arrayOf(PropTypes.string),
            feature: PropTypes.arrayOf(PropTypes.string),
            technology: PropTypes.arrayOf(PropTypes.string),
            regularity: PropTypes.string.isRequired,
        }).isRequired,
    };

    static isArraysSame(a, b) {
        if (a === b) return true;
        if (!Array.isArray(a)) return false;
        if (!Array.isArray(b)) return false;

        const aSet = new Set(a);

        return b.reduce((result, item) => result && aSet.delete(item), true) && aSet.size === 0;
    }
    static isFiltersEqual(a, b) {
        return a.type === b.type
            && Map.isArraysSame(a.service, b.service)
            && Map.isArraysSame(a.product, b.product)
            && Map.isArraysSame(a.feature, b.feature)
            && Map.isArraysSame(a.technology, b.technology)
            && a.regularity === b.regularity;
    }

    state = {
        details: [],
    };

    componentDidMount() {
        this.fetchDetailedData();
    }

    componentWillReceiveProps(nextProps) {
        if (!Map.isFiltersEqual(nextProps.filter, this.props.filter)) {
            this.fetchDetailedData(nextProps.filter);
        }
    }

    fetchDetailedData(filter = this.props.filter) {
        rest.post('/api/v1/dashboard/map/detailed', filter)
            .then(({ data }) => {
                this.setState({
                    details: data,
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    details: [],
                });
            });
    }

    getTitle() {
        const { mrfId, type } = this.props;

        if (mrfId === undefined) {
            return (
                <span>
                    {'Средний показатель '}
                    <KQI
                        className={styles.mapTitleKQI}
                        type={type}
                    />
                    {' по МРФ'}
                </span>
            );
        }

        const mrf = this.state.details.find(r => r.id === mrfId);
        if (mrf === undefined) return '';

        return (
            <span>
                {`Средний показатель ${extractRegionName(mrf.name)} `}
                <KQI
                    className={styles.mapTitleKQI}
                    type={type}
                />
                {' по МРФ'}
            </span>
        );
    }

    render() {
        const { mrfId, type } = this.props;
        let kqi = {};
        if (mrfId === undefined) {
            kqi = this.state.details.reduce((acc, region) => ({
                ...acc,
                [region.id]: region.kqi,
            }), {});
        } else {
            const mrf = this.state.details.find(mrf => mrf.id === mrfId);

            if (mrf !== undefined) {
                kqi = mrf.rf.reduce((acc, region) => ({
                    ...acc,
                    [region.id]: region.kqi,
                }), {});
            }
        }

        return (
            <WidgetWrapper
                className={styles.map}
                title={this.getTitle()}
                backLink={mrfId === undefined ? undefined : this.props.buildLink({ mrfId: null })}
            >
                <RussianMap
                    mrfId={this.props.mrfId}
                    type={type}
                    kqi={kqi}
                    plan={this.props.plan}
                    buildLink={this.props.buildLink}
                />
            </WidgetWrapper>
        );
    }
}

export default Map;
