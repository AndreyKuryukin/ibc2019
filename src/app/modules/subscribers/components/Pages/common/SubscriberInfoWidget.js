import React from 'react';
import PropTypes from 'prop-types';
import TreeView from '../../TreeView';
import Widget from '../../Widget';
import {MRFPropType, RFPropType} from '../../../../../reducers/common/location';
import ls from "i18n";

class SubscriberInfoWidget extends React.Component {
    static propTypes = {
        subscriber: PropTypes.shape({
            nls: PropTypes.string,
            san: PropTypes.string,
            sqm_mrf_id: PropTypes.number,
            region_id: PropTypes.number,
            locality: PropTypes.string,
            street: PropTypes.string,
            house: PropTypes.string,
            service_id: PropTypes.string.isRequired
        }),
        technology: PropTypes.string,
        commutator: PropTypes.string,
        mrfById: PropTypes.objectOf(MRFPropType),
        rfById: PropTypes.objectOf(RFPropType),
    };

    getProperty(property, defaultValue) {
        return this.props.subscriber === null
            ? defaultValue
            : (this.props.subscriber[property] || defaultValue);
    }

    getData() {
        const mrfId = this.getProperty('sqm_mrf_id', null);
        const rfId = this.getProperty('region_id', null);

        return [
            {
                id: 'nls',
                name: ls('NLS', 'Номер лицевого счёта'),
                value: this.getProperty('nls', '-'),
            }, {
                id: 'san',
                name: 'SAN',
                value: this.getProperty('san', '-'),
            }, {
                id: 'mrf',
                name: 'Region',
                value: 9,
            }, {
                id: 'technology',
                name: 'Connection technology',
                value: this.props.technology || '',
            }, {
                id: 'address',
                name: 'Address',
                value: [
                    this.getProperty('region'),
                    this.getProperty('locality'),
                    this.getProperty('street'),
                    this.getProperty('house'),
                ].filter(v => !!v).join(', '),
            }, {
                id: 'commutator',
                name: ls('ACC_COMMUTATOR', 'Коммутатор доступа'),
                value: this.props.commutator || '',
            },
        ];
    }

    checkIsCellLoading = (value, node, columnKey) => {
        if (columnKey !== 'value') return false;
        if (node.id === 'technology') return this.props.technology === null;
        if (node.id === 'commutator') return this.props.commutator === null;
        return false;
    };

    render() {
        return (
            <Widget>
                <TreeView
                    id="subscriber-common-info"
                    data={this.getData()}
                    columns={[
                        {
                            name: 'name',
                            width: '30%',
                        }, {
                            name: 'value',
                            width: '70%',
                        },
                    ]}
                    checkIsCellLoading={this.checkIsCellLoading}
                />
            </Widget>
        );
    }
}

export default SubscriberInfoWidget;
