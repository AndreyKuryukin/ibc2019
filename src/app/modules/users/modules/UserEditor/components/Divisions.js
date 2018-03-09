import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Panel from '../../../../../components/Panel';
import ls from "i18n";


class Divisions extends React.Component {

    static propTypes = {
        data: PropTypes.array,
        checked: PropTypes.array
    };

    onCheck = () => {

    };

    mapData = () => {

    };

    headerRowRender = () => {

    };

    bodyRowRender = () => {

    };

    render() {
        const {
            data,
        } = this.props;
        return <div className={styles.userEditorColumn}>
            <Panel
                title={ls('USER_DIVISION_PANEL_TITLE', 'Division')}
                bodyStyle={{ padding: 0 }}
            >
                <TreeView
                    data={this.mapData(data)}
                    headerRowRender={this.headerRowRender}
                    bodyRowRender={this.bodyRowRender}
                />
            </Panel>
        </div>
    }
}

export default Divisions;