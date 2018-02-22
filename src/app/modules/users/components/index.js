import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Button } from 'reactstrap';
import UserEditor from '../modules/UserEditor/containers';
import UsersTable from './UsersTable';

class Users extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        usersData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        isLoading: false,
        onMount: () => null,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onAdd = () => {
        this.props.history.push('/users/add');
    }

    render() {
        const { match } = this.props;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? Number(params.id) : null;

        return (
            <div className={styles.usersWrapper}>
                <div className={styles.controlsWrapper}>
                    <Button color="primary" onClick={this.onAdd}>Add</Button>
                    <Button color="primary">Block</Button>
                    <Button color="primary">Unblock</Button>
                </div>
                <UsersTable
                    data={this.props.usersData}
                />
                {isEditorActive && <UserEditor
                    active={isEditorActive}
                    userId={userId}
                />}
            </div>
        );
    }
}

export default Users;
