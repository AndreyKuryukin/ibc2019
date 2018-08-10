import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import styles from './styles.scss';
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input";

class ConfigsControls extends React.PureComponent {
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

    onSearchTextChange = (searchText) => {
        this.props.onSearchTextChange(searchText);
    };

    onConfigure = () => {
        this.context.history.push('/kqi/configure');
    };

    render() {
        return (
            <div className={styles.kqiControls}>
                {this.context.hasAccess('KQI', 'EDIT') && <div className={styles.buttonsGroup}>
                    <Icon
                        itemId="kqi_configs_add"
                        icon="kqiAdd"
                        onClick={this.onConfigure}
                        title={ls('ADD_KQI_CALCULATION_TITLE', 'Добавить KQI')}
                    />
                </div>}
                <Input
                    itemId="kqi_configs_search_field"
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default ConfigsControls;

