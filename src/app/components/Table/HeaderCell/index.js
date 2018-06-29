import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';
import ColumnFilterTrigger from '../ColumnFilter/ColumnFilterTrigger';
import ColumnFilterForm from '../ColumnFilter/ColumnFilterForm';

class HeaderCell extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        filterable: PropTypes.bool,
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onClick: PropTypes.func,
        onColumnFilterChange: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: '',
        filterable: false,
        width: null,
        onClick: () => null,
        onColumnFilterChange: () => null,
    };

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
    };

    onMouseLeave = () => {
        this.setState({
            isFilterTriggerActive: false,
        });
    };

    onTriggerClick = (e) => {
        this.setState({
            isFilterFormActive: !this.state.isFilterFormActive,
        });
        e.stopPropagation();
    };

    onColumnFilterChange = (filterValues) => {
        this.setState({
            isFilterTriggerActive: !!filterValues.values().next().value,
        });
        this.props.onColumnFilterChange(filterValues);
    };

    render() {
        const { filterable, className, children, width, onClick } = this.props;
        const { isFilterTriggerActive, isFilterFormActive } = this.state;
        const style = { width };

        return (
            <div
                className={classnames(styles.headerCell, className)}
                style={style}
                onClick={onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {children}
                {filterable && <ColumnFilterTrigger active={isFilterTriggerActive} onClick={this.onTriggerClick} />}
                {filterable && <ColumnFilterForm active={isFilterFormActive} onColumnFilterChange={this.props.onColumnFilterChange} />}
            </div>
        );
    }
}

export default HeaderCell;
