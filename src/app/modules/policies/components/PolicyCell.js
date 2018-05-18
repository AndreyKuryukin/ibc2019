import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

class PolicyCell extends React.PureComponent {
    static contextTypes = {
        sort: PropTypes.func.isRequired,
    };

    static propTypes = {
        title: PropTypes.string,
        name: PropTypes.string,
        columns: PropTypes.array,
        isInHeader: PropTypes.bool,
        sort: PropTypes.object,
    };

    static defaultProps = {
        title: '',
        name: '',
        columns: [],
        isInHeader: false,
        sort: null,
    };

    onColumnClick = (columnName) => {
        if (this.props.sort !== null) {
            this.context.sort(`${this.props.name}.${columnName}`);
        }
    };

    onParentClick = (e) => {
        e.stopPropagation();
    };

    render() {
        const { title, name: columnName, columns, isInHeader, sort } = this.props;

        return (
            <div className={styles.policyCell} onClick={this.onParentClick}>
                {title && <div className={styles.title}>{title}</div>}
                {columns.map(({ title, name }) => {
                    const sortDirection = sort && sort.by === `${columnName}.${name}` ? sort.direction : null;
                    return (
                        <div
                            key={name}
                            className={classnames(styles.subtitle, { [styles.inHeader]: isInHeader })}
                            onClick={() => this.onColumnClick(name)}
                        >
                            {sortDirection && <span>{sortDirection === 'asc' ? '\u2B07' : '\u2B06'}</span>}
                            {title ? <div>{title}</div> : <div>&nbsp;</div>}
                        </div>
                    )})
                }
            </div>
        );
    }
}

export default PolicyCell;
