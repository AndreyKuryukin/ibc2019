import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import memoize from 'memoizejs';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import ParameterField from './ParameterField';
import styles from './styles.scss';

const instanceFieldStyle = { flexGrow: 1, marginTop: 0 };

class ConfigBlock extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.node,
        config: PropTypes.object,
        onRemove: PropTypes.func,
        onChangeInstance: PropTypes.func,
        onChangeParameters: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        config: null,
        onRemove: () => null,
        onChangeInstance: () => null,
        onChangeParameters: () => null,
    };

    static mapOptions = memoize(opts => opts.map(opt => ({
        value: opt.instance_id,
        title: opt.name,
    })));

    onChangeInstance = (instanceId) => {
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

    onRemove = () => {
        this.props.onRemove(this.props.id);
    };

    render() {
        const { config } = this.props;
        return (
            <div className={styles.configBlock}>
                <div className={styles.configContentRow}>
                    <div className={styles.configBlockContent}>
                        <div className={styles.configContentRow}>
                            <div className={styles.adapterName}>
                                {`${ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_LABEL', 'Адаптер')}: ${_.get(config, 'name', '')}`}
                            </div>
                            {_.get(config, 'instances', []).length > 0 && <Field
                                id="instance"
                                labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                                inputWidth={115}
                                style={instanceFieldStyle}
                            >
                                <Select
                                    id="instance"
                                    options={ConfigBlock.mapOptions(_.get(config, 'instances', []))}
                                    value={_.get(config, 'instance_id', '')}
                                    onChange={this.onChangeInstance}
                                />
                            </Field>}
                        </div>
                        <div className={styles.configContentColumn}>
                            {_.get(config, 'parameters', []).map((param, index) => (
                                <ParameterField
                                    key={this.props.id + `_${param.uid}`}
                                    id={param.uid}
                                    type={param.type}
                                    name={param.name}
                                    value={param.value}
                                    values={param.values}
                                    required={param.required}
                                    onChange={this.onChangeParameter.bind(this, index)}
                                />
                            ))}
                        </div>
                    </div>
                    <span
                        className={styles.configBlockRemove}
                        onClick={this.onRemove}
                    >×</span>
                </div>
            </div>
        );
    }
}

export default ConfigBlock;