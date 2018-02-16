import React from 'react';
import PropTypes from 'prop-types';
import Controls, { Control, Left } from 'qreact/lib/Table/Controls/Controls';
import { Checkbox, Icon, TextInputTypeahead as Search } from 'qreact';
import styles from './styles.scss';

class RolesControls extends React.PureComponent {
    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        onDelete: PropTypes.func,
        onAdd: PropTypes.func,
        isAllChecked: PropTypes.bool,
        checkedRoles: PropTypes.array,
        isAnyChecked: PropTypes.bool,
    };

    render() {
        const { isAllChecked } = this.props;
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
                            onChange={this.props.onCheckAll}
                            checked={isAllChecked}
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
                            disabled
                            onClick={() => {}}
                        />
                    </Control>
                </Left>
                <Search
                    onChange={this.props.onSearchTextChange}
                    className={styles.search}
                    placeholder="Поиск"
                />
            </Controls>
        );
    }
}

export default RolesControls;
