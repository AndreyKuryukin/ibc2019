import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../../components/Input';
import Icon from "../../../components/Icon/Icon";
import _ from 'lodash';

import styles from './styles.scss';
import ls from "i18n";

class PoliciesControls extends React.PureComponent {
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
        this.context.history.push('/policies/add');
    };

    onSearchTextChange = (searchText) => {
        this.props.onSearchTextChange(searchText);
    };

    render() {
        return (
            <div className={styles.policiesControls}>
                {this.context.hasAccess('POLICY', 'EDIT') && <div className={styles.buttonGroup}>
                    <Icon
                        icon="addIcon"
                        onClick={this.onAdd}
                        title={ls('ADD_POLICY_TITLE', 'Добавить политику')}
                    />
                </div>}
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default PoliciesControls;
