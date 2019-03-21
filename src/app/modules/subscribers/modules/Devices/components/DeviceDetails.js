import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './device-details.scss';
import * as _ from "lodash";
import Graph from "./Graph";
import LoadingNode from "../../../components/TreeView/LoadingNode";

class DeviceDetails extends React.Component {
    static propTypes = {
        kabData: PropTypes.array,
        periodUnit: PropTypes.string,
        kabDataLoading: PropTypes.bool,
        item: PropTypes.shape({
            name: PropTypes.string,
            vendor: PropTypes.string,
            model: PropTypes.string,
            version: PropTypes.string,
            uptime: PropTypes.string,
            device: PropTypes.object
        }).isRequired,
    };

    constructor(props) {
        super();
        this.state = {
            data: this.mapData(props.kabData, props.item)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.kabData !== nextProps.kabData) {
            this.setState({ data: this.mapData(nextProps.kabData, nextProps.item) });
        }
    }

    mapData = (data, item) => {
        const { id, mac } = item.device;
        const deviseKabData = _.find(data, { id: id || mac });
        if (deviseKabData && deviseKabData.value) {
            return deviseKabData.value
        }
        return false
    };

    renderKabData = (data, item, kabDataLoading, periodUnit) => {
        if (kabDataLoading) {
            return <LoadingNode small/>
        } else if (data === false) {
            return ''
        } else {
            return <Graph data={data}
                          periodUnit={periodUnit}
                          id={item.id}
            />
        }
    };

    render() {
        const { item, kabDataLoading, periodUnit, disabled } = this.props;
        const type = _.get(item, 'device.type');
        const { data } = this.state;
        return (
            <div className={styles.deviceDetailsItem}>
                <div className={styles.parameters}>
                    <div className={cn(styles.parameter, styles.name)}>
                        <div className={styles.name}>Name:</div>
                        <div className={styles.value}>{item.name}</div>
                    </div>
                    <div className={cn(styles.parameter, styles.vendor)}>
                        <div className={styles.name}>Vendor:</div>
                        <div className={styles.value}>{item.vendor}</div>
                    </div>
                    <div className={cn(styles.parameter, styles.model)}>
                        <div className={styles.name}>Model:</div>
                        <div className={styles.value}>{item.model}</div>
                    </div>
                    <div className={cn(styles.parameter, styles.version)}>
                        <div className={styles.name}>Firmware:</div>
                        <div className={styles.value}>{item.version}</div>
                    </div>
                    {type === 'STB' && <div className={cn(styles.parameter, styles.uptime)}>
                        <div className={styles.name}>Uptime:</div>
                        <div className={styles.value}>{item.uptime}</div>
                    </div>}
                </div>
                {this.renderKabData(data, item, kabDataLoading, periodUnit)}
            </div>
        )
    }
}

export default DeviceDetails;
