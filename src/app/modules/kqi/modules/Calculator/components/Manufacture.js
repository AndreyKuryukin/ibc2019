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

const panelStyle = { flex: '1 1 0', zIndex: 0 };
const allManufacturesFieldStyle = { width: 100 };
const gridCellStyle = { marginLeft: 0 };

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
            checkedNodes: [],
            manufactureList: this.mapData(props.manufactureList)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.state.checked) {
            this.setState({ checked: nextProps.checked })
        }
        if (nextProps.manufactureList !== this.props.manufactureList) {
            this.setState({ manufactureList: this.mapData(nextProps.manufactureList) })
        }
    }

    mapData = (data = []) => _.uniqBy(data, item => item.manufacture).map(item => ({
        name: item.manufacture,
        id: item.manufacture,
        equipment: item.equipment
    }));

    bodyRowRender = (column, node) => {
        const checked = this.state.checked.includes(node.id);
        return (
            <CheckedCell
                id={`kqi-manufacture-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={gridCellStyle}
                value={checked}
                text={node[column.name]}
            />
        );
    };

    onCheck = (value, node) => {
        let checked = [];
        let checkedNodes = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id);
            checkedNodes = value ? [...this.state.checkedNodes, node] : this.state.checkedNodes.filter(item => item.id !== node.id);
        } else {
            checked = value ? this.state.manufactureList.map(node => node.id) : [];
            checkedNodes = value ? this.state.manufactureList: [];
        }

        this.setState({
            checked,
            checkedNodes
        });

        this.props.onCheckManufactures(checkedNodes);
    };

    render() {
        const checkedPartially = this.props.manufactureList.length !== 0
            && this.state.checked.length > 0
            && this.state.checked.length < this.props.manufactureList.length;
        const isAllChecked = !checkedPartially && this.props.manufactureList.length !== 0
            && this.state.checked.length === this.props.manufactureList.length;
        const { disabled } = this.props;
        return (
            <Panel
                title={ls('KQI_CALCULATOR_MANUFACTURE_TITLE', 'Производитель')}
                style={panelStyle}
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
                            style={allManufacturesFieldStyle}
                            splitter=""
                        >
                            <Checkbox
                                itemId="kqi_projections_manufactures_check"
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
                        data={this.state.manufactureList}
                        bodyRowRender={this.bodyRowRender}
                        noCheckAll
                        noSearch
                        disabled={disabled}
                    />
                </div>
                <Field
                    id="manufacture-grouping"
                    labelText={ls('KQI_CALCULATOR_MANUFACTURE_GROUPING_FIELD_LABEL', 'С группировкой по производителю оборудования')}
                    inputWidth={25}
                    labelWidth={300}
                    labelAlign="right"
                    splitter=""
                    style={{
                        justifyContent: 'flex-end'
                    }}
                >
                    <Checkbox
                        itemId="kqi_projections_manufactures_grouping_check"
                        id="manufacture-grouping"
                        checked={this.props.isGroupingChecked}
                        onChange={this.props.onGroupingChange}
                        disabled={disabled || this.state.checked.length === 1}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Manufacture;
