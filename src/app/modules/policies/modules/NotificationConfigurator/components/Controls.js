import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import ls from 'i18n';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from '../../../../../components/Icon/Icon';
import styles from './styles.scss';

const marginLeft = 10;
const controlFieldStyle = { width: `calc((100% - ${22 + marginLeft}px) / 2)` };
const adapterFieldStyle = { ...controlFieldStyle, marginLeft };
const instanceFieldStyle = { ...controlFieldStyle, marginTop: 0 };

class Controls extends React.PureComponent {
    static propTypes = {
        adapters: PropTypes.array,
        selectedConfigsKeys: PropTypes.array,
        onAddConfig: PropTypes.func,
    };

    static defaultProps = {
        adapters: [],
        selectedConfigsKeys: [],
        onAddConfig: () => null,
    };

    static mapOptions = memoize(opts => opts.map(opt => ({
        value: opt.adapter_id || opt.instance_id,
        title: opt.name,
    })));

    constructor(props) {
        super(props);

        this.state = {
            selectedAdapter: '',
            selectedInstance: '',
        };
    }

    getInstancesOptions = (adapterId) => {
        const selectedAdapter = this.props.adapters.find(adapter => adapter.adapter_id === adapterId);

        return selectedAdapter ? Controls.mapOptions(selectedAdapter.instances) : [];
    };

    onAddConfig = () => {
        const { selectedAdapter: adapterId, selectedInstance } = this.state;
        if (adapterId) {
            const selectedAdapter = this.props.adapters.find(adapter => adapter.adapter_id === adapterId);

            this.props.onAddConfig({
                ...selectedAdapter,
                instance_id: selectedInstance,
            });
        }
    };

    onChangeAdapter = (adapter) => {
        this.setState({
            selectedAdapter: adapter || '',
            selectedInstance: '',
        });
    };

    onChangeInstance = (instance) => {
        this.setState({ selectedInstance: instance || '' });
    };

    render() {
        const {
            adapters,
            selectedConfigsKeys,
        } = this.props;
        const { selectedAdapter, selectedInstance } = this.state;
        const instanceOptions = this.getInstancesOptions(this.state.selectedAdapter);
        const isAddButtonDisabled = selectedConfigsKeys.includes(`${selectedAdapter}_${selectedInstance}`)
            || (instanceOptions.length > 0 && !selectedInstance) || !selectedAdapter;

        return (
            <div className={styles.configsControls}>
                <Icon
                    itemId="policies_configurator_add_adapter"
                    title={ls('POLICIES_NOTIFICATIONS_ADD_ADAPTER', 'Добавить адаптер')}
                    icon="addIcon"
                    disabled={isAddButtonDisabled}
                    onClick={this.onAddConfig}
                />
                <Field
                    id="adapter"
                    inputWidth="100%"
                    style={adapterFieldStyle}
                    splitter=""
                >
                    <Select
                        itemId="policies_configurator_adapter_field"
                        id="adapter"
                        options={Controls.mapOptions(adapters)}
                        value={selectedAdapter}
                        onChange={this.onChangeAdapter}
                        placeholder={ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_PLACEHOLDER', 'Адаптер')}
                    />
                </Field>
                {instanceOptions.length > 0 && <Field
                    id="instance"
                    labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                    labelWidth="30%"
                    inputWidth="70%"
                    style={instanceFieldStyle}
                >
                    <Select
                        itemId="policies_configurator_instance_field"
                        id="instance"
                        options={instanceOptions}
                        value={selectedInstance}
                        onChange={this.onChangeInstance}
                        placeholder={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_PLACEHOLDER', 'Инстанс')}
                    />
                </Field>}
            </div>
        );
    }
}

export default Controls;