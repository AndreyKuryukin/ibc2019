import React from 'react';
import PropTypes from 'prop-types';
import { CheckedCell } from '../../../../../../components/Table/Cells';
import { getChildrenIds, checkNodeAndGetCheckedIds } from '../../../../../../util/tree';
import search from '../../../../../../util/search';

import Grid from '../../../../../../components/Grid';
const treeData = [
    {
        id: 1,
        name: 'Главная',
        children: [
            {
                id: 2,
                name: 'Просмотр',
            },  {
                id: 3,
                name: 'Создание виджета',
            }, {
                id: 4,
                name: 'Удаление виджета',
            }, {
                id: 5,
                name: 'Редактирование виджета',
            },
        ]
    }, {
        id: 6,
        name: 'Конфиг БПАС',
        children: [
            {
                id: 7,
                name: 'Просмотр',
            },  {
                id: 8,
                name: 'Восстановление конфига',
            }, {
                id: 9,
                name: 'Обновление конфига',
            }, {
                id: 10,
                name: 'Удаление конфига',
            },
        ]
    }
];

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        onCheck: PropTypes.func,
        checked: PropTypes.array,
    };

    static defaultProps = {
        subjectsData: [],
        onCheck: () => null
    };

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            checked: props.checked ? props.checked : [],
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.checked !== nextProps.checked) {
    //         this.setState({
    //             checked: nextProps.checked
    //         });
    //     }
    // }

    onCheckAll = (value) => {
        const allIds = treeData.reduce((result, next) => result.concat([next.id, ...getChildrenIds(next)]), []);
        this.setState({
            checked: value ? allIds : [],
        });
    };

    onCheck = (value, node) => {
        this.setState({
            checked: checkNodeAndGetCheckedIds(this.state.checked, node, value),
        });
    };

    bodyRowRender = (column, node) => {
        let checkedPartially = false;
        let checked = this.state.checked.includes(node.id);
        if (node.children && node.children.length > 0) {
            checkedPartially = !checked && getChildrenIds(node).some(id => this.state.checked.includes(id));
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

    filter = (data, searchText) => data.filter(node => {
        return search(node.name, searchText) || (node.children && this.filter(node.children, searchText).length > 0);
    });

    render() {
        const { subjectsData } = this.props;
        const isAllChecked = treeData.every(node => this.state.checked.includes(node.id));
        const checkedPartially = !isAllChecked && this.state.checked.length > 0;
        const filteredData = this.state.searchText ? this.filter(treeData, this.state.searchText) : treeData;

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
