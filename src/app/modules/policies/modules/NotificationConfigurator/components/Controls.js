import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import ls from 'i18n';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import Icon from '../../../../../components/Icon/Icon';
import styles from './styles.scss';

const controlFieldStyle = { flexGrow: 1 };
const adapterFieldStyle = { ...controlFieldStyle, marginLeft: 10 };
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
        const isAddButtonDisabled = selectedConfigsKeys.includes(`${selectedAdapter}_${selectedInstance}`);

        return (
            <div className={styles.configsControls}>
                <Icon
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
                        id="adapter"
                        options={Controls.mapOptions(adapters)}
                        value={selectedAdapter}
                        onChange={this.onChangeAdapter}
                        placeholder={ls('POLICIES_CONFIGURATOR_ADAPTER_FIELD_PLACEHOLDER', 'Адаптер')}
                    />
                </Field>
                <Field
                    id="instance"
                    labelText={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_LABEL', 'Инстанс')}
                    labelWidth="30%"
                    inputWidth={115}
                    style={instanceFieldStyle}
                >
                    <Select
                        id="instance"
                        options={this.getInstancesOptions(this.state.selectedAdapter)}
                        value={selectedInstance}
                        onChange={this.onChangeInstance}
                        placeholder={ls('POLICIES_CONFIGURATOR_INSTANCE_FIELD_PLACEHOLDER', 'Инстанс')}
                    />
                </Field>
            </div>
        );
    }
}

export default Controls;