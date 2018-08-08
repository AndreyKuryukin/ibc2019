import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Panel from '../../../../../components/Panel';
import MacList from './MacList';
import KqiList from './KqiList';
import ScopeList from './ScopeList';

const TECH_OPTIONS = [
    { value: 'FTTB', title: 'FTTB' },
    { value: 'GPON', title: 'GPON' },
    { value: 'XDSL', title: 'xDSL' },
];

class Scope extends React.PureComponent {
    static propTypes = {
        scopes: PropTypes.object,
        scopeList: PropTypes.array,
        kqiList: PropTypes.array,
        mrfList: PropTypes.array,
        rfList: PropTypes.array,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        scopes: {},
        scopeList: [],
        kqiList: [],
        mrfList: [],
        rfList: [],
        onChange: () => null,
    };

    getScopeList = (scope, values) => {
        const commonProps = {
            values,
            onChange: v => this.onChange(scope, v),
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
                        options={this.mapLocationLists(this.props.mrfList)}
                        {...commonProps}
                    />
                );
            case 'RF':
                return (
                    <ScopeList
                        itemId="policies_rf_scope"
                        id="scope-list-rf"
                        placeholder={ls('POLICY_RF_LIST_PLACEHOLDER', 'Выберите РФ')}
                        options={this.mapLocationLists(this.props.rfList)}
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

    mapScopes = scopes => scopes.map(scope => ({ value: scope, title: scope }));

    mapLocationLists = locations => locations.map(location => ({ value: location.id, title: location.name }));

    onChange = (key, value, deleteKey) => {
        const scopes = { ...this.props.scopes };

        if (key) {
            _.set(scopes, key, value);
        }

        delete scopes[deleteKey];

        this.props.onChange(scopes);
    };

    render() {
        const { scopes, scopeList, kqiList, mrfList, rfList } = this.props;

        return (
            <Panel
                title={ls('POLICIES_SCOPE_TITLE', 'Область применения')}
            >
                {_.isEmpty(scopes) ? (
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
                            options={this.mapScopes(scopeList)}
                            onChange={value => this.onChange(value, [])}
                        />
                    </Field>
                ) : (
                    _.map(scopes, (values, scope) => (
                        <Fragment>
                            <Field
                                id={`scope-${scope}`}
                                inputWidth="100%"
                                splitter=""
                            >
                                <Select
                                    id={`scope-${scope}`}
                                    type="select"
                                    placeholder={ls('POLICY_SCOPE_TYPE_PLACEHOLDER', 'Область применения')}
                                    options={this.mapScopes(scopeList)}
                                    value={scope}
                                    onChange={value => this.onChange(value, [], scope)}
                                />
                            </Field>
                            {this.getScopeList(scope, values)}
                        </Fragment>
                    ))
                )}
            </Panel>
        );
    }

}

export default Scope;
