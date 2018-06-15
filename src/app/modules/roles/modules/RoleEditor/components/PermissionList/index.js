import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizejs';
import { CheckedCell } from '../../../../../../components/Table/Cells';
import { checkNodeAndGetCheckedIds, getChildrenIds } from '../../../../../../util/tree';
import search from '../../../../../../util/search';
import Grid from '../../../../../../components/Grid';
import * as _ from "lodash";
import ls from "i18n";

const checkedCellStyle = { marginLeft: 0 };

class RolesListGrid extends React.PureComponent {
    static propTypes = {
        subjectsData: PropTypes.array,
        accessLevelTypes: PropTypes.array,
        onCheck: PropTypes.func,
        checked: PropTypes.array,
    };

    static defaultProps = {
        subjectsData: [],
        accessLevelTypes: [],
        checked: [],
        onCheck: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            checked: props.checked ? props.checked : [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.checked !== nextProps.checked) {
            this.setState({
                checked: this.accessLevelsToIds(nextProps.checked),
            });
        }
    }

    mapData = memoize((subjects, levelTypes) => levelTypes.length ?
        subjects.map(subj => ({
            ...subj,
            children: levelTypes.map(lvl => ({ id: `${subj.name}.${lvl}`, name: lvl })),
        })) : []);

    accessLevelsToIds = access_levels => access_levels.map(level => {
        const { subject, access_level_type } = level;

        return `${subject.name}.${access_level_type}`;
    });

    idsToAccessLevels = ids => ids.reduce((result, nextId) => {
        const [name, access_level_type] = nextId.split('.');
        const subject = this.props.subjectsData.find(subj => subj.name === name);

        return subject ? [...result, {
            access_level_type,
            subject,
        }] : result;
    }, []);

    onCheckAll = (value, data) => {
        const allIds = value ?
            data.reduce((result, next) => result.concat([next.id, ...getChildrenIds(next)]), [])
            : [];

        this.props.onCheck(this.idsToAccessLevels(allIds));
    };

    onCheck = (value, node) => {
        const checked = checkNodeAndGetCheckedIds(this.state.checked, node, value);

        this.props.onCheck(this.idsToAccessLevels(checked));
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
                style={checkedCellStyle}
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
        const { subjectsData, accessLevelTypes } = this.props;
        const data = this.mapData(subjectsData, accessLevelTypes);
        const isAllChecked = data.every(node => node.children.every(child => this.state.checked.includes(child.id)));
        const checkedPartially = !isAllChecked && this.state.checked.length > 0;
        const filteredData = this.state.searchText ? this.filter(data, this.state.searchText) : data;

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
                onCheckAll={value => this.onCheckAll(value, data)}
                onSearchTextChange={this.onSearchTextChange}
                tree
            />
        );
    }
}

export default RolesListGrid;
