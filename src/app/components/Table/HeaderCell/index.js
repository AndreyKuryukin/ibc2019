import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import classNames from 'classnames';
import ColumnFilterTrigger from '../ColumnFilter/ColumnFilterTrigger';
import ColumnFilterForm from '../ColumnFilter/ColumnFilterForm';

class HeaderCell extends React.PureComponent {
    static propTypes = {
        filterable: PropTypes.bool,
        onClick: PropTypes.func,
        headerRowRender: PropTypes.func,
        onColumnFilterChange: PropTypes.func,
    }

    static defaultProps = {
        filterable: false,
        onClick: () => null,
        headerRowRender: () => null,
        onColumnFilterChange: () => null,
    }

    constructor(props) {
        super(props);

        this.state = {
            isFilterTriggerActive: false,
            isFilterFormActive: false,
        };
    }

    onMouseEnter = () => {
        this.setState({
            isFilterTriggerActive: true,
        });
    }

    onMouseLeave = () => {
        this.setState({
            isFilterTriggerActive: false,
        });
    }


    onTriggerClick = (e) => {
        this.setState({
            isFilterFormActive: !this.state.isFilterFormActive,
        });
        e.stopPropagation();
    }

    onColumnFilterChange = (filterValues) => {
        this.setState({
            isFilterTriggerActive: !!filterValues.values().next().value,
        });
        this.props.onColumnFilterChange(filterValues);
    }

    render() {
        const {
            filterable,
            onClick,
            headerRowRender
        } = this.props;
        const { isFilterTriggerActive, isFilterFormActive } = this.state;
        const classes = classNames(
            styles.headerCell,
            styles.thFix,
        );
        return (
            <th
                className={classes}
                onClick={onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {headerRowRender()}
                {filterable && <ColumnFilterTrigger active={isFilterTriggerActive} onClick={this.onTriggerClick} />}
                {filterable && <ColumnFilterForm active={isFilterFormActive} onColumnFilterChange={this.props.onColumnFilterChange} />}
            </th>
        );
    }
}

export default HeaderCell;
