import React from 'react';
import PropTypes from 'prop-types';
import { Table as ReactstrapTable } from 'reactstrap';

import styles from './styles.scss';

class Table extends React.PureComponent {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        selectable: PropTypes.bool,
    };

    static defaultProps = {
        data: [],
        columns: [],
        headerRowRender: () => null,
        bodyRowRender: () => null,
        selectable: false,
    };

    constructor(props) {
        super();
        this.state = {
            cntrlIsPressed: false,
            selected: []
        }
    }

    componentDidiMount() {
        if (this.props.selectable) {
            this.addListeners()
        }
    }

    componentWillUnmount() {
        if (this.props.selectable) {
            this.removeListeners()
        }
    }

    onKeyDownListener = (event) => {
        if (event.which === "17")
            this.setState({ cntrlIsPressed: true });
    };

    onKeyUpListener = (event) => {
        if (event.which === "17")
            this.setState({ cntrlIsPressed: false });
    };

    addListeners = () => {
        document.addEventListener('keydown', this.onKeyDownListener);
        document.addEventListener('keyup', this.onKeyUpListener);
    };

    removeListeners = () => {
        document.removeEventListener('keydown', this.onKeyDownListener);
        document.removeEventListener('keyup', this.onKeyUpListener);
    };

    onRowClick = (node) => {
        if (this.state.cntrlIsPressed) {
            this.setState({selected: [...this.state.selected, node.id]})
        }
    }

    render() {
        const { data, columns, headerRowRender, bodyRowRender, selectable, ...rest } = this.props;
        const {selected} = this.state;
        return (
            <ReactstrapTable striped {...rest}>
                <thead>
                <tr>
                    {columns.map(column => (
                        <th className={styles.thFix} key={column.name}>{headerRowRender(column)}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map(node => (
                    <tr key={node.id}
                        onClick={() => this.onRowClick(node)}
                        className={(selected.findIndex(id => node.id === id) !== -1) && styles.selected}
                    >
                        {columns.map(column => (
                            <td key={column.name}>
                                {bodyRowRender(column, node)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </ReactstrapTable>
        );
    }
}

export default Table;
