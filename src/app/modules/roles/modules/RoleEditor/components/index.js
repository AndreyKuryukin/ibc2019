import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Panel, Field, TextInput, TextInputTypeahead } from 'qreact';
import RolesListGrid from '../container/RolesListGrid';

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
                title={'Создание новой роли'}
                width={400}
                onSubmit={() => {}}
                onCancel={() => {}}
                onClose={() => {}}
                submitLabel={'ОК'}
                cancelLabel={'Отменить'}
                bodyStyle={{ overflow: 'visible' }}
                submitDisabled={false}
                cancelDisabled={false}
                active={this.props.active}
            >
                <Panel
                    title={'Главная информация'}
                    vertical
                    noScroll
                >
                    <Field
                        label={'Имя роли'}
                        labelWidth={200}
                        className={styles.field}
                    >
                        <TextInput
                            id="name"
                            name="name"
                            value={''}
                            onChange={() => {}}
                        />
                    </Field>
                    <Field
                        label={'Копировать разрешение из'}
                        labelWidth={200}
                        className={styles.field}
                    >
                        <TextInput
                            id="source"
                            name="source"
                            value={''}
                            onChange={() => {}}
                        />
                    </Field>
                </Panel>
                <Panel
                    title={'Разрешения'}
                    vertical
                    noScroll
                    style={{ height: 300 }}
                >
                    <RolesListGrid />
                </Panel>
                <Panel
                    title={'Комментарий'}
                    vertical
                    noScroll
                >
                    <TextInputTypeahead
                        id="role-comment"
                        className={styles.textarea}
                        value={''}
                        onChange={() => {}}
                        maxlength={255}
                        multiline
                        rows={6}
                    />
                </Panel>
            </Modal>
        )
    }
}

export default RoleEditor;
