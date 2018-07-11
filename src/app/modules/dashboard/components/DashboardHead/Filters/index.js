import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ls from 'i18n';
import styles from './styles.scss';
import Filter from './Filter';

class Filters extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            defaultTitle: PropTypes.string.isRequired,
            options: PropTypes.array.isRequired,
        })),
        values: PropTypes.objectOf(PropTypes.array),
        onChange: PropTypes.func.isRequired,
    };

    onChange(filterId, optionId, isChecked) {
        const type = this.props.list.find(filter => filter.id === filterId).type || 'bool';

        const result = { ...this.props.values };

        if (type === 'radio') {
            result[filterId] = [optionId];
        } else {
            if (result[filterId] === undefined) {
                result[filterId] = [];
            }

            if (isChecked) {
                result[filterId] = [...result[filterId], optionId];
            } else {
                result[filterId] = result[filterId].filter(id => id !== optionId);
            }
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
                            name={filter.id}
                            className={styles.dashboardFiltersGroup}
                            title={ls(`DASHBOARD_FILTERS_${filter.id.toUpperCase()}_TITLE`, filter.defaultTitle)}
                            type={filter.type}
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
