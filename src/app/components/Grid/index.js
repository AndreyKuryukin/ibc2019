import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Table from '../Table';
import TreeView from '../TreeView';

import styles from './styles.scss';

class Grid extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        isAllChecked: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        noCheckAll: PropTypes.bool,
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        onCheckAll: PropTypes.func,
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: [],
        isAllChecked: false,
        checkedPartially: false,
        tree: false,
        noCheckAll: false,
        headerRowRender: null,
        bodyRowRender: () => null,
        onCheckAll: () => null,
        onSearchTextChange: () => null,
    };

    render() {
        const {
            id,
            isAllChecked,
            onCheckAll,
            onSearchTextChange,
            checkedPartially,
            tree,
            noCheckAll,
            ...rest
        } = this.props;

        return (
            <div className={styles.gridWrapper}>
                <div className={styles.gridControls}>
                    {!noCheckAll && <Checkbox
                        id={`${id}-all`}
                        onChange={onCheckAll}
                        checked={isAllChecked}
                        checkedPartially={checkedPartially}
                    />}
                    <Input
                        placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                        className={styles.gridSearch}
                        onChange={e => onSearchTextChange(_.get(e, 'currentTarget.value', ''))}
                    />
                </div>
                <div className={styles.gridBody}>
                    {tree ? <TreeView
                        {...rest}
                    /> : <Table
                        {...rest}
                    />}
                </div>
            </div>
        );
    }
}

export default Grid;
