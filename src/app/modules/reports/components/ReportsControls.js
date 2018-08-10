import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input";

import styles from './styles.scss';

class ReportsControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
        hasAccess: PropTypes.func.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
    };

    onAdd = () => {
        this.context.history.push('/reports/add');
    };

    onSearchTextChange = (searchText) => {
        this.props.onSearchTextChange(searchText);
    };

    render() {
        return (
            <div className={styles.reportControls}>
                {this.context.hasAccess('REPORTS', 'EDIT') && <Icon
                    itemId="reports_add"
                    icon="addIcon"
                    onClick={this.onAdd}
                    title={ls('ADD_REPORT_TITLE', 'Добавить отчёт')}
                />}
                <Input
                    itemId="reports_search_field"
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default ReportsControls;
