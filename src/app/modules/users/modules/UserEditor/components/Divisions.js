import React from 'react';
import PropTypes from 'prop-types';
import ls from "i18n";
import memoize from 'memoizejs';
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';
import search from '../../../../../util/search';
import styles from './styles.scss';

const bodyStyle = { padding: 0 };

class Divisions extends React.Component {

    static propTypes = {
        data: PropTypes.array,
        division: PropTypes.string,
        onCheck: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        division: '',
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            division: props.division,
            searchText: '',
        };
    }

    static getColumns = memoize(() => [{
        name: 'name',
        searchable: true,
    }]);

    componentWillReceiveProps(nextProps) {
        if (this.props.division !== nextProps.division) {
            this.setState({
                division: nextProps.division,
            });
        }
    }

    onCheck = (value, node) => {
        this.setState({
            division: node.id,
        });

        this.props.onCheck(node.id);
    };

    bodyRowRender = (column, node) => {
        let checked = this.state.division === node.id;

        return (
            <CheckedCell
                id={`user-editor-divisions-grid-${node.id}`}
                onChange={(value) => this.onCheck(value, node)}
                style={{ marginLeft: 0 }}
                value={checked}
                checkedPartially={false}
                type={'radio'}
                text={node[column.name]}
            />
        );
    };

    onSearchTextChange = (searchText) => {
        this.setState({ searchText });
    };

    filter = (data, searchText) => data.filter(node => search(node.name, searchText) || (node.children && this.filter(node.children, searchText).length > 0));

    render() {
        const { data } = this.props;
        const { searchText } = this.state;

        const filteredData = searchText ? this.filter(data, searchText) : data;

        return (
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Подразделения')}
                className={styles.divisionsPanel}
                bodyStyle={bodyStyle}
            >
                <Grid
                    id="user-editor-divisions-grid"
                    itemId="users_divisions"
                    data={filteredData}
                    columns={[
                        {
                            name: 'name',
                        }
                    ]}
                    noCheckAll
                    bodyRowRender={this.bodyRowRender}
                    checkedPartially={false}
                    isAllChecked={false}
                    onSearchTextChange={this.onSearchTextChange}
                    tree
                />
            </Panel>
        );
    }
}

export default Divisions;