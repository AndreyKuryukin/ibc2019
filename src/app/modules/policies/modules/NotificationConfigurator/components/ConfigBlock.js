import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import ParameterField from './ParameterField';
import styles from './styles.scss';

const instanceFieldStyle = { flexGrow: 1, marginTop: 0 };
const MATCHERS_BY_UID = {
    numbers: /^([0-9]){0,11}$/,
    emails: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

class ConfigBlock extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.node,
        config: PropTypes.object,
        configs: PropTypes.array,
        onRemove: PropTypes.func,
        onChangeInstance: PropTypes.func,
        onChangeParameters: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        config: null,
        configs: [],
        onRemove: () => null,
        onChangeInstance: () => null,
        onChangeParameters: () => null,
    };

    static mapOptions = (config, configs) => {
        const opts = _.get(config, 'instances', []);
        const instanceId = _.get(config, 'instance_id');
        const adapterId = _.get(config, 'adapter_id');
        return opts.filter(opt => {
            const specificConfigs = configs.filter(cfg => cfg.adapter_id === adapterId);
            return opt.instance_id === instanceId || specificConfigs.findIndex(cfg => cfg.instance_id === opt.instance_id) === -1
        })
            .map((opt) => ({
                value: opt.instance_id,
                title: opt.name,
            }));

    };

    onChangeInstance = (instanceId) => {
        console.log(this.props.configs);
        this.props.onChangeInstance(instanceId);
    };

    onChangeParameter = (index, value) => {
        const parameters = [..._.get(this.props.config, 'parameters', [])];
        const param = {
            ..._.get(parameters, `${index}`),
            value: value || '',
        };
        _.set(parameters, `${index}`, param);
        this.props.onChangeParameters(parameters);
    };

    render() {
        const { config, configs, onRemove } = this.props;
        const errors = _.get(config, 'errors');
        return (
            <div className={styles.configBlock}>
                <div className={styles.configContentRow}>
                    <div className={styles.configBlockContent}>
                        <div className={styles.configContentRow}>
                            <div className={styles.adapterName}>
                                {`${ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_LABEL', 'Адаптер')}: ${_.get(config, 'name', '')}`}
                            </div>
                            {_.get(config, 'instances', []).length > 0 && <Field
                                id={`${this.props.id}_instance`}
                                labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                                inputWidth={115}
                                style={instanceFieldStyle}
                                required
                            >
                                <Select
                                    id={`${this.props.id}_instance`}
                                    options={ConfigBlock.mapOptions(config, configs)}
                                    noEmptyOption
                                    value={_.get(config, 'instance_id', '') || ''}
                                    onChange={this.onChangeInstance}
                                    placeholder={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_PLACEHOLDER', 'Инстанс')}
                                    errorMessage={_.get(errors, `instance_id.title`, '')}
                                    valid={_.get(config, 'instance_id', '') || _.isEmpty(errors)}
                                />
                            </Field>}
                        </div>
                        <div className={styles.configContentColumn}>
                            {_.get(config, 'parameters', []).map((param, index) => (
                                <ParameterField
                                    key={this.props.id + `_${param.uid}`}
                                    id={this.props.id + `_${param.uid}`}
                                    type={param.type}
                                    name={param.name}
                                    value={param.value}
                                    values={param.values}
                                    required={param.required}
                                    multiple={param.multiple}
                                    matcher={MATCHERS_BY_UID[param.uid]}
                                    onChange={this.onChangeParameter.bind(this, index)}
                                    errors={param.errors}
                                />
                            ))}
                        </div>
                    </div>
                    <span
                        className={styles.configBlockRemove}
                        onClick={onRemove}
                    >×</span>
                </div>
            </div>
        );
    }
}

export default ConfigBlock;