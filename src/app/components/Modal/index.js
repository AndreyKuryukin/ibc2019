import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as ReactstrapModal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DraggableWrapper from "../DraggableWrapper/index";

class Modal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        size: PropTypes.string,
    }

    static defaultProps = {
        isOpen: false,
        title: '',
        className: '',
        size: '',
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
            size,
            submitTitle,
            cancelTitle
        } = this.props;
        return (
            <DraggableWrapper>
                <ReactstrapModal isOpen={isOpen} toggle={onClose} className={className} size={size}>
                    <ModalHeader toggle={onClose} className={'handle'}>{title}</ModalHeader>
                    <ModalBody>
                        {this.props.children}
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action" onClick={onClose}>{cancelTitle || 'Cancel'}</Button>
                        <Button color="action" onClick={onSubmit}>{submitTitle || 'OK'}</Button>
                    </ModalFooter>
                </ReactstrapModal>
            </DraggableWrapper>
        );
    }
}

export default Modal;
