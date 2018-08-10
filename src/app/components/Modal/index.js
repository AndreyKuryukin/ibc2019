import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as ReactstrapModal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DraggableWrapper from "../DraggableWrapper/index";

class Modal extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool,
        itemId: PropTypes.string,
        title: PropTypes.string,
        className: PropTypes.string,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        size: PropTypes.string,
    }

    static defaultProps = {
        isOpen: false,
        itemId: '',
        title: '',
        className: '',
        size: '',
        onSubmit: () => null,
        onClose: () => null,
    };

    componentDidMount() {
        if (this.props.className) {
            const closeBtn = document.querySelector(`.${this.props.className} .close`);

            if (closeBtn) {
                closeBtn.setAttribute('itemId', `${this.props.itemId}_close`);
            }
        }
    }

    render() {
        const {
            isOpen,
            title,
            itemId,
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
                        <Button itemId={`${itemId}_cancel`} outline color="action" onClick={onClose}>{cancelTitle || 'Cancel'}</Button>
                        <Button itemId={`${itemId}_ok`} color="action" onClick={onSubmit}>{submitTitle || 'OK'}</Button>
                    </ModalFooter>
                </ReactstrapModal>
            </DraggableWrapper>
        );
    }
}

export default Modal;
