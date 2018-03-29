import React from 'react';
import PropTypes from 'prop-types';
import ls from "i18n";
import Panel from '../../../../../components/Panel';
import Grid from '../../../../../components/Grid'
import { CheckedCell } from '../../../../../components/Table/Cells';

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
        };
    }

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

    render() {
        const {
            data,
        } = this.props;

        return (
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Подразделения')}
                bodyStyle={{ padding: 0 }}
            >
                <Grid
                    id="user-editor-divisions-grid"
                    data={data}
                    columns={[
                        {
                            name: 'name',
                        }
                    ]}
                    noCheckAll
                    bodyRowRender={this.bodyRowRender}
                    checkedPartially={false}
                    isAllChecked={false}
                    tree
                />
            </Panel>
        );
    }
}

export default Divisions;