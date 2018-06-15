import React from 'react';
import PropTypes from 'prop-types';
import { CheckedCell } from '../../../../../../components/Table/Cells';
import { checkNodeAndGetCheckedIds, getChildrenIds } from '../../../../../../util/tree';
import search from '../../../../../../util/search';
import Grid from '../../../../../../components/Grid';
import * as _ from "lodash";
import ls from "i18n";

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        onCheck: PropTypes.func,
        checked: PropTypes.array,
    };

    static defaultProps = {
        subjectsData: [],
        checked: [],
        onCheck: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            checked: props.checked ? props.checked : [],
            subjectsData: props.subjectsData ? props.subjectsData : [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.checked !== nextProps.checked) {
            this.setState({
                checked: nextProps.checked
            });
        }
        if (this.props.subjectsData !== nextProps.subjectsData) {
            this.setState({
                checked: nextProps.checked,
                subjectsData: this.mapData(nextProps.subjectsData)
            });
        }
    }

    mapData = subjects => subjects.map(subj => ({
        ...subj,
        children: ['EDIT', 'VIEW'].map(lvl => ({ id: `${subj.name}.${lvl}`, name: lvl })),
    }));

    onCheckAll = (value) => {
        const allIds = value ?
            this.props.subjectsData.reduce((result, next) => result.concat([next.id, ...getChildrenIds(next)]), [])
            : [];
        this.setState({
            checked: allIds,
        });

        this.props.onCheck(allIds);
    };

    onCheck = (value, node) => {
        const checked = checkNodeAndGetCheckedIds(this.state.checked, node, value);
        this.setState({ checked });
        this.props.onCheck(checked);
    };

    bodyRowRender = (column, node) => {
        let checkedPartially = false;
        let checked = this.state.checked.includes(node.id);
        if (node.children && node.children.length > 0) {
            const childrenIds = getChildrenIds(node);
            if (childrenIds.length === childrenIds.filter(id => this.state.checked.includes(id)).length) {
                checked = true;
            }
            checkedPartially = !checked && childrenIds.some(id => this.state.checked.includes(id));
        }

        return (
            <CheckedCell
                id={`role-editor-subjects-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={{ marginLeft: 0 }}
                value={checked}
                checkedPartially={checkedPartially}
                text={node[column.name]}
            />
        );
    };

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    filter = (data, searchText) => data.filter(node => search(node.name, searchText) || (node.children && this.filter(node.children, searchText).length > 0));

    render() {
        const { subjectsData } = this.state;
        const isAllChecked = subjectsData.every(node => this.state.checked.includes(node.id));
        const checkedPartially = !isAllChecked && this.state.checked.length > 0;
        const filteredData = this.state.searchText ? this.filter(subjectsData, this.state.searchText) : subjectsData;

        return (
            <Grid
                id="role-editor-subjects-grid"
                data={filteredData}
                columns={[
                    {
                        name: 'name',
                    }
                ]}
                bodyRowRender={this.bodyRowRender}
                checkedPartially={checkedPartially}
                isAllChecked={isAllChecked}
                onCheckAll={this.onCheckAll}
                onSearchTextChange={this.onSearchTextChange}
                tree
            />
        );
    }
}

export default RolesListGrid;
