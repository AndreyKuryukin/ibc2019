import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import Grid from '../../../../../components/Grid';
import styles from './styles.scss';
import { CheckedCell } from '../../../../../components/Table/Cells';

class Manufacture extends React.PureComponent {
    static propTypes = {
        isGroupingChecked: PropTypes.bool,
        manufactureList: PropTypes.array,
        onCheckManufactures: PropTypes.func,
        onGroupingChange: PropTypes.func,
    };

    static defaultProps = {
        isGroupingChecked: false,
        manufactureList: [],
        onCheckManufactures: () => null,
        onGroupingChange: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.state.checked) {
            this.setState({ checked: nextProps.checked })
        }
    }

    bodyRowRender = (column, node) => {
        const checked = this.state.checked.includes(node.id);
        return (
            <CheckedCell
                id={`kqi-manufacture-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={{ marginLeft: 0 }}
                value={checked}
                text={node[column.name]}
            />
        );
    };

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.manufactureList.map(node => node.id) : [];
        }

        this.setState({
            checked,
        });

        this.props.onCheckManufactures(checked);
    };

    render() {
        const checkedPartially = this.props.manufactureList.length !== 0
            && this.state.checked.length > 0
            && this.state.checked.length < this.props.manufactureList.length;
        const isAllChecked = !checkedPartially && this.props.manufactureList.length !== 0
            && this.state.checked.length === this.props.manufactureList.length;
        const { disabled, groupingValue } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_MANUFACTURE_TITLE', 'Производитель')}
                style={{ flex: '1 1 0' }}
            >
                <div className={styles.manufactures}>
                    <div className={styles.manufactureLabel}>
                        <span>{`${ls('KQI_CALCULATOR_MANUFACTURE_TITLE', 'Производитель')}:`}</span>
                        <Field
                            id="all-manufactures"
                            labelText={ls('KQI_CALCULATOR_MANUFACTURE_CHECK_ALL', 'Выбрать все')}
                            labelWidth="75%"
                            inputWidth="25%"
                            labelAlign="right"
                            style={{ width: 100 }}
                        >
                            <Checkbox
                                id="all-manufactures"
                                checked={isAllChecked}
                                checkedPartially={checkedPartially}
                                onChange={this.onCheck}
                                disabled={disabled}
                            />
                        </Field>
                    </div>

                    <Grid
                        id="kqi-manufacture-grid"
                        columns={[{ name: 'name' }]}
                        data={this.props.manufactureList}
                        bodyRowRender={this.bodyRowRender}
                        noCheckAll
                        noSearch
                        disabled={disabled}
                    />
                </div>
                <Field
                    id="manufacture-grouping"
                    labelText={ls('KQI_CALCULATOR_MANUFACTURE_GROUPING_FIELD_LABEL', 'С группировкой по производителю оборудования')}
                    labelWidth="97%"
                    inputWidth="3%"
                    labelAlign="right"
                >
                    <Checkbox
                        id="manufacture-grouping"
                        checked={this.props.isGroupingChecked || groupingValue}
                        onChange={this.props.onGroupingChange}
                        disabled={disabled}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Manufacture;
