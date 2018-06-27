import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import styles from './styles.scss';
import Icon from "../../../components/Icon/Icon";
import Input from "../../../components/Input";

class ProjectionsControls extends React.PureComponent {
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

    onCalculate = () => {
        this.context.history.push('/kqi/calculate');
    };

    render() {
        return (
            <div className={styles.kqiControls}>
                {this.context.hasAccess('KQI', 'EDIT') && <div className={styles.buttonsGroup}>
                    <Icon
                        icon="addIcon"
                        onClick={this.onCalculate}
                        title={ls('ADD_KQI_PROJECTION_TITLE', 'Добавить проекцию KQI')}
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

export default ProjectionsControls;

