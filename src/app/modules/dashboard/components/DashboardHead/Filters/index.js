import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';
import Filter from './Filter';

class Filters extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            options: PropTypes.array.isRequired,
        })),
        values: PropTypes.objectOf(PropTypes.array),
        onChange: PropTypes.func.isRequired,
    };

    onChange(filterId, optionId, isChecked) {
        const result = { ...this.props.values };

        if (result[filterId] === undefined) {
            result[filterId] = [];
        }

        if (isChecked) {
            result[filterId] = [...result[filterId], optionId];
        } else {
            result[filterId] = result[filterId].filter(id => id !== optionId);
        }

        if (result[filterId].length === 0) {
            // delete result[filterId];
        }

        this.props.onChange(result);
    }

    render() {
        const { className, list, values } = this.props;

        return (
            <div className={classNames(styles.dashboardFiltersWrapper, className)}>
                {list.reduce((result, filter, i) => {
                    if (i !== 0) {
                        result.push(
                            <div
                                key={`separator-${i}`}
                                className={styles.dashboardFiltersSeparator}
                            />
                        );
                    }

                    const onChangeCallback = filter.editable
                        ? (optionId, value) => this.onChange(filter.id, optionId, value)
                        : undefined;

                    result.push(
                        <Filter
                            key={filter.id}
                            className={styles.dashboardFiltersGroup}
                            title={filter.title}
                            options={filter.options}
                            values={values[filter.id] || []}
                            onChange={onChangeCallback}
                        />
                    );
                    return result;
                }, [])}
            </div>
        );
    }
}

export default Filters;
