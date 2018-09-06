import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import Chip from '../../../../../components/Chip/Chip';
import MacList from './MacList';
import KqiList from './KqiList';
import ScopeList from './ScopeList';

const TECH_OPTIONS = [
    { value: 'FTTB', title: 'FTTB' },
    { value: 'GPON', title: 'GPON' },
    { value: 'XDSL', title: 'xDSL' },
];

const scopePanelStyle = { marginTop: 0 };
const scopePanelBodyStyle = { flexWrap: 'wrap' };
const chipStyle = { margin: '2px 2px 0 0' };

class Scope extends React.PureComponent {
    static propTypes = {
        scopes: PropTypes.object,
        scopeList: PropTypes.array,
        kqiList: PropTypes.array,
        mrfList: PropTypes.array,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        scopes: {},
        scopeList: [],
        kqiList: [],
        mrfList: [],
        onChange: () => null,
    };

    constructor() {
        super();

        this.state = { selectedScope: '' };
    }

    getRfList = () => {
        const mrfs = _.get(this.props, 'scopes.MRF', []);
        let rfList = [];

        if (mrfs.length > 0) {
            rfList = _.chain(this.props.mrfList)
                .filter(mrf => mrfs.includes(mrf.id))
                .map('rf')
                .flatten()
                .value();
        } else {
            rfList = _.chain(this.props.mrfList)
                .map('rf')
                .flatten()
                .value();
        }

        return rfList;
    };

    getScopeList = (scope, values) => {
        const commonProps = {
            values,
            onChange: this.onAddScopeValue,
        };

        switch(scope) {
            case 'TECH':
                return (
                    <ScopeList
                        itemId="policies_tech_scope"
                        id="scope-list-tech"
                        placeholder={ls('POLICY_TECH_LIST_PLACEHOLDER', 'Выберите технологию')}
                        options={TECH_OPTIONS}
                        {...commonProps}
                    />
                );
            case 'MRF':
                return (
                    <ScopeList
                        itemId="policies_mrf_scope"
                        id="scope-list-mrf"
                        placeholder={ls('POLICY_MRF_LIST_PLACEHOLDER', 'Выберите МРФ')}
                        options={this.mapIdNameList(this.props.mrfList)}
                        {...commonProps}
                    />
                );
            case 'RF':
                return (
                    <ScopeList
                        itemId="policies_rf_scope"
                        id="scope-list-rf"
                        placeholder={ls('POLICY_RF_LIST_PLACEHOLDER', 'Выберите РФ')}
                        options={this.mapIdNameList(this.getRfList())}
                        {...commonProps}
                    />
                );
            case 'MAC':
                return (
                    <MacList
                        itemId="policies_mac_scope"
                        macs={values}
                        onChange={commonProps.onChange}
                    />
                );
            case 'KQI_PROJECTION':
                return (
                    <KqiList
                        itemId="policies_kqi_scope"
                        selected={values}
                        onChange={commonProps.onChange}
                        kqiList={this.props.kqiList}
                    />
                );
            default:
                return null;
        };
    };

    getScopeOptionTitle = (scope, value) => {
        if (scope === 'MAC') return value;

        const finder = option => option.value === value;

        switch(scope) {
            case 'TECH':
                return _.get(TECH_OPTIONS.find(finder), 'title', null);
            case 'MRF':
                return _.get(this.mapIdNameList(this.props.mrfList).find(finder), 'title', null);
            case 'RF':
                return _.get(this.mapIdNameList(this.getRfList()).find(finder), 'title', null);
            case 'KQI_PROJECTION':
                return _.get(this.mapIdNameList(this.props.kqiList).find(finder), 'title', null);
            default:
                return null;

        };
    };

    mapScopes = scopes => scopes.map(scope => ({ value: scope, title: ls(`POLICIES_${scope}_OPTION_TITLE`, scope) }));

    mapIdNameList = list => list.map(node => ({ value: node.id, title: node.name }));

    onAddScopeValue = (value) => {
        const { selectedScope } = this.state;
        const scopes = {
            ...this.props.scopes,
            [selectedScope]: value,
        };

        if (selectedScope === 'MRF' && scopes.MRF.length === 1 && scopes.RF) {
            const rfsOfMrf = _.chain(this.props.mrfList)
                .find(mrf => mrf.id === scopes.MRF[0])
                .get('rf', [])
                .map('id')
                .value();

            scopes.RF = scopes.RF.filter(rfId => rfsOfMrf.includes(rfId));

            if (scopes.RF.length === 0) {
                delete scopes.RF;
            }
        }

        this.props.onChange(scopes);
    }

    onChangeScope = (selectedScope) => {
        this.setState({ selectedScope });
    }

    onRemoveScopeValue = (scope, value) => {
        const scopes = { ...this.props.scopes };
        const values = _.without(scopes[scope], value);

        if (values.length !== 0) {
            scopes[scope] = values;
        } else {
            delete scopes[scope];
        }

        if (scope === 'MRF' && scopes.RF) {
            const rfsOfMrf = _.chain(this.props.mrfList)
                .find(mrf => mrf.id === value)
                .get('rf', [])
                .map('id')
                .value();

            scopes.RF = !scopes.MRF ? scopes.RF : scopes.RF.filter(rfId => !rfsOfMrf.includes(rfId));

            if (scopes.RF.length === 0) {
                delete scopes.RF;
            }
        }

        this.props.onChange(scopes);
    }

    render() {
        const { scopes, scopeList, kqiList, mrfList, rfList } = this.props;
        const { selectedScope } = this.state;

        return (
            <Fragment>
                <Panel
                    title={ls('POLICIES_SCOPE_TITLE', 'Область применения')}
                >
                    <Field
                        id="scope"
                        inputWidth="100%"
                        splitter=""
                    >
                        <Select
                            itemId="policies_scope_field"
                            id="scope"
                            type="select"
                            placeholder={ls('POLICY_SCOPE_TYPE_PLACEHOLDER', 'Область применения')}
                            value={selectedScope}
                            options={this.mapScopes(scopeList)}
                            onChange={this.onChangeScope}
                        />
                    </Field>
                    {selectedScope && this.getScopeList(selectedScope, scopes[selectedScope])}
                </Panel>
                {!_.isEmpty(scopes) && _.map(scopes, (values, scope) => (
                    <Panel
                        title={ls(`POLICIES_${scope}_OPTION_TITLE`, scope)}
                        style={scopePanelStyle}
                        bodyStyle={scopePanelBodyStyle}
                        horizontal
                    >
                        {values.map(value => (
                            <Chip
                                style={chipStyle}
                                key={scope + '_' + value}
                                title={this.getScopeOptionTitle(scope, value)}
                                onRemove={() => this.onRemoveScopeValue(scope, value)}
                            />
                        ))}
                    </Panel>
                ))}
            </Fragment>
        );
    }

}

export default Scope;
