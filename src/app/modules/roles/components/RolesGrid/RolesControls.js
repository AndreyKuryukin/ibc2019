import React from 'react';
import PropTypes from 'prop-types';
import Controls, { Control, Left } from 'qreact/lib/Table/Controls/Controls';
import { Checkbox, Icon, TextInputTypeahead as Search } from 'qreact';
import styles from './styles.scss';

class RolesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        isAllChecked: PropTypes.bool,
        onDelete: PropTypes.func,
    };

    static defaultProps = {
        isAllChecked: false,
        onSearchTextChange: () => null,
        onCheckAll: () => null,
        onDelete: () => null,
    };

    onAdd = () => {
        this.context.history.push('/roles/add');
    }

    render() {
        const { isAllChecked, onDelete } = this.props;
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
                            onClick={this.onAdd}
                        />
                    </Control>
                    <Control>
                        <Icon
                            icon="delete-btn"
                            onClick={onDelete}
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
