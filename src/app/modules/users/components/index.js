import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import Modal from '../../../components/Modal';
import { Button } from 'reactstrap';
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

    onClose = () => {
        this.props.history.goBack();
    }

    render() {
        const { match } = this.props;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? Number(params.id) : null;

        return (
            <div className={styles.usersWrapper}>
                <div className={styles.controlsWrapper}>
                    <Button outline color="primary" onClick={this.onAdd}>Add</Button>
                    <Button outline color="primary">Block</Button>
                    <Button outline color="primary">Unblock</Button>
                </div>
                <UsersTable
                    data={this.props.usersData}
                />
                {isEditorActive && <Modal
                    isOpen={isEditorActive}
                    title="Создание пользователя"
                    onClose={this.onClose}
                    onSubmit={this.onSubmit}
                >
                    <div>qwedsa</div>
                </Modal>}
            </div>
        );
    }
}

export default Users;
