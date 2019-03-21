import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from '../../../components/Widget';
import styles from './topology.scss';
import { KQIPropType } from '../../../containers/TopologyProvider';
import { createKRenderer } from '../../../helpers';
import Icon, { ICONS } from './Icon';
import Arrow from './Arrow';
import LoadingNode from '../../../components/TreeView/LoadingNode';
import * as _ from "lodash";
import ls from "i18n";

const IconBySQMType = {
    ACC: ICONS.ACCESS,
    AGG: ICONS.COMMUTATOR,
    PE: ICONS.RE_ROUTER,
};

class TopologyComponent extends React.Component {
    static propTypes = {
        subscriberDevices: PropTypes.array,
        nodes: PropTypes.array,
        topologyDevices: PropTypes.array,
        devicesKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        stbsKQI: PropTypes.objectOf(PropTypes.shape({
            current: KQIPropType,
            previous: KQIPropType,
        })),
        isKQILoading: PropTypes.bool.isRequired,
        kgsLoading: PropTypes.bool.isRequired,
        isTopologyLoading: PropTypes.bool.isRequired,
    };


    getKRenderer = (node, type) => {
        return createKRenderer(_.get(node, `threshold.${type}.itv1`, 95));
    };

    renderKab = (node, isKQILoading) => {
        return node.kqi !== undefined ? (
            <Fragment>
                <span>К<sub>sub</sub></span> {(isKQILoading
                    ? <LoadingNode small className={styles.topologyKqiLoader}/>
                    : this.getKRenderer(node, 'KAB')(node.kqi.current, node.kqi.previous)
            )}
            </Fragment>
        ) : (
            <span>&nbsp;</span>
        )
    };
// <span>К<sub>гс</sub></span>
    renderKgs = (node, kgsLoading) => {
        return <Fragment>
            <span>К<sub>гс</sub></span>
            {kgsLoading ? <LoadingNode small className={styles.topologyKqiLoader}/> :
                node.kgs !== undefined ? this.getKRenderer(node, 'KGS')(_.get(node, 'kgs.current.0.kgs'), _.get(node, 'kgs.previous.0.kgs')) :
                    <span>&nbsp;</span>}
        </Fragment>
    };

    renderNode = (node, index) => {
        if (node === null) return null;

        const { isKQILoading, kgsLoading } = this.props;

        return (
            <div
                key={node.id}
                className={styles['topology-node']}
            >
                <div className={styles.info}>
                    {node.icon !== undefined && (
                        <Icon
                            src={node.icon}
                            alert={node.kqi !== undefined && node.kqi.current < 95}
                            disabled={node.disabled}
                        />
                    )}
                    <div className={styles.text}>
                        <span className={styles.name}>{node.name}</span>
                        <div className={styles.kqi}>
                            {node.id === 'base' ? this.renderKgs(node, kgsLoading) : this.renderKab(node, isKQILoading)}
                        </div>
                    </div>
                </div>
                <div className={styles.children}>
                    {node.children.map(this.renderNode)}
                </div>

                {index !== null && <Arrow index={index}/>}
            </div>
        );
    };

    renderTree() {
        if (this.props.isTopologyLoading) return <LoadingNode/>;

        return (
            <div className={styles.topology}>
                {this.renderNode(this.props.nodes, null)}
            </div>
        );
    }

    render() {
        return (
            <Widget
                title={ls('NETWORK_TOPOLOGY', 'Network topology')}
            >
                {this.renderTree()}
            </Widget>
        );
    }
}

export default TopologyComponent;
