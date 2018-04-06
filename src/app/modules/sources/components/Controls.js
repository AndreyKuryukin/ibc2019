import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap'
import ls from 'i18n';
import Icon from "../../../components/Icon/Icon";
import * as _ from "lodash";
import styles from './styles.scss';

class SourcesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onRefresh: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onRefresh: () => null,
    };

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value'));
    };

    onRefresh = () => {
        this.props.onRefresh();
    };

    render() {
        return (
            <div className={styles.controls}>
                <Icon icon="refresh-icon" onClick={this.onRefresh}/>
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default SourcesControls;
