import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class Modal extends React.PureComponent {
    static propTypes = {
        isOpen:  PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
    }

    static defaultProps = {
        isOpen: false,
        title: '',
        className: '',
        onSubmit: () => null,
        onClose: () => null,
    };

    render() {
        const {
            isOpen,
            title,
            onSubmit,
            onClose,
            className,
        } = this.props;
        return (
            <ReactstrapModal isOpen={isOpen} toggle={onClose} className={className}>
                <ModalHeader toggle={onClose}>{title}</ModalHeader>
                <ModalBody>
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onSubmit}>OK</Button>
                    <Button color="secondary" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default Modal;
