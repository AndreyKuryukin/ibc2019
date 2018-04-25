import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import memoize from 'memoizejs';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './styles.scss';
import DraggableWrapper from "../../../../../../../components/DraggableWrapper";

const infoScheme = [
    'appearing_time',
    'policy_name',
    'duration',
    'message',
    'finished_notifications',
    'attributes',
];

class CrashViewer extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        crash: PropTypes.object,
        active: PropTypes.bool,
    };

    static defaultProps = {
        crash: null,
        active: false,
    };

    onClose = () => {
        this.context.history.push('/crashes/group-policies/current');
    };

    render() {
        const { crash } = this.props;
        return (
            <DraggableWrapper>
                <Modal
                    isOpen={this.props.active}
                    className={styles.crashesViewer}
                >
                    <ModalHeader
                        toggle={this.onClose}
                        className="handle"
                    >
                        {`${ls('CRASHES_GROUP_POLICIES_CRASHES_VIEWER_TITLE', 'Детальная информация по ГП аварии №')}${_.get(crash, 'id', '')} (${_.get(crash, 'priority', '')})`}
                    </ModalHeader>
                    <ModalBody>
                        <div className={styles.crashesViewerContent}>
                            {infoScheme.map(key => (
                                <div key={key} className={styles.crashesViewerRow}>
                                    <div>{ls(`CRASHES_GROUP_POLICIES_CRASHES_VIEWER_${key.toUpperCase()}`)}</div>
                                    <div>{_.get(crash, key, '')}</div>
                                </div>
                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="action" onClick={this.onClose}>{ls('CRASHES_GROUP_POLICIES_CRASHES_VIEWER_CANCEL', 'Отмена')}</Button>
                        <Button color="action" onClick={this.onSubmit}>{ls('CRASHES_GROUP_POLICIES_CRASHES_VIEWER_OK', 'Ок')}</Button>
                    </ModalFooter>
                </Modal>
            </DraggableWrapper>
        );
    }
}

export default CrashViewer;