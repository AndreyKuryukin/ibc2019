import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'reactstrap';
import ls from 'i18n';
import classNames from 'classnames';
import DraggableWrapper from '../DraggableWrapper';
import styles from './styles.scss';

const ConfirmDialog = ({ active, defaultX, defaultY, className, message, cancelButtonTitle, okButtonTitle, cancelButtonAction, okButtonAction }) => (
    <DraggableWrapper
        defaultPosition={{ x: defaultX, y: defaultY }}
    >
        <Modal
            isOpen={active}
            className={classNames(styles.confirmModal, className)}
        >
            <div className={classNames(styles.confirmMessage, 'handle')}>{message}</div>
            <div className={styles.buttonGroup}>
                <Button outline color="action" onClick={cancelButtonAction}>{cancelButtonTitle}</Button>
                <Button color="action" onClick={okButtonAction}>{okButtonTitle}</Button>
            </div>
        </Modal>
    </DraggableWrapper>
);

ConfirmDialog.propTypes = {
    active: PropTypes.bool,
    defaultX: PropTypes.number,
    defaultY: PropTypes.number,
    className: PropTypes.string,
    message: PropTypes.string,
    cancelButtonTitle: PropTypes.string,
    okButtonTitle: PropTypes.string,
    cancelButtonAction: PropTypes.func,
    okButtonAction: PropTypes.func,
};

ConfirmDialog.defaultProps = {
    active: false,
    defaultX: 0,
    defaultY: 0,
    className: '',
    message: '',
    cancelButtonTitle: ls('CANCEL', 'Отмена'),
    okButtonTitle: ls('OK', 'ОК'),
    cancelButtonAction: () => null,
    okButtonAction: () => null,
};

export default ConfirmDialog;