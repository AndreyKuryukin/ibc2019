import React from 'react';
import PropTypes from 'prop-types';
import Controls, { Control, Left } from 'qreact/lib/Table/Controls/Controls';
import { Checkbox, Icon, TextInputTypeahead as Search } from 'qreact';
import styles from './styles.scss';

class RolesControls extends React.PureComponent {
    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        onCheckAll: PropTypes.func.isRequired,
        onUncheckAll: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        onAdd: PropTypes.func,
        checkedAll: PropTypes.bool,
        checkedRoles: PropTypes.array,
        searchText: PropTypes.string,
        isAnyChecked: PropTypes.bool,
    };

    onCheckAll = (isChecked) => {
        console.log(isChecked);
    }

    onSearchChange = (text) => {
        console.log(text);
    }

    render() {
        return (
            <Controls>
                <Left>
                    <Control>
                        <Checkbox
                            id="roles-all"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 33,
                                height: '100%',
                                cursor: 'pointer',
                                marginBottom: 0,
                            }}
                            onChange={this.onCheckAll}
                            checked={false}
                        />
                    </Control>
                    <Control>
                        <Icon
                            icon="create-btn"
                            disabled={false}
                            onClick={() => {}}
                        />
                    </Control>
                    <Control>
                        <Icon
                            icon="delete-btn"
                            disabled={false}
                            onClick={() => {}}
                        />
                    </Control>
                </Left>
                <Search
                    onChange={this.onSearchChange}
                    className={styles.search}
                    placeholder={'Поиск'}
                />
            </Controls>
        );
    }
}

export default RolesControls;
