import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Panel } from 'qreact';

import styles from './styles.scss';

class RoleEditor extends React.PureComponent {
    static propTypes = {
        role: PropTypes.object,
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
    };

    render() {
        return (
            <Modal
                title={this.props.serviceId ? ls(i18n.SERVICES_EDITOR_TITLE_EDIT) : ls(i18n.SERVICES_EDITOR_TITLE_CREATE)}
                width={710}
                onSubmit={this.onSubmit}
                onCancel={this.props.onToggle}
                onClose={this.props.onToggle}
                submitLabel={ls(i18n.DONE)}
                cancelLabel={ls(i18n.CANCEL)}
                bodyStyle={{ overflow: 'visible' }}
                submitDisabled={false}
                cancelDisabled={this.state.isSaving}
                active={this.props.active}
                submitHidden={!editBindings && !editParameters}
            >
            </Modal>
        )
    }
}

export default RoleEditor;
