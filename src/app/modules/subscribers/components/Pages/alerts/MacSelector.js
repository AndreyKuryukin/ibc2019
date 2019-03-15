import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import styles from './ip-filter.scss';
import { formatMAC } from '../../../util';
import Field from '../../../../../components/Field';
import Radio from '../../../../../components/Radio';

const MacSelector = props => (
    <div className={styles['ip-filter']}>
        <span className={styles.title}>{ls('SUBSCRIBERS_MAC_SELECTOR_TITLE', 'MAC адрес')}</span>
        {props.macList.map(mac => (
            <Field
                key={mac}
                id={`${mac}-filter`}
                labelText={formatMAC(mac)}
                inputWidth={20}
                labelAlign="right"
                splitter=""
            >
                <Radio
                    id={`${mac}-filter`}
                    name="mac-option"
                    checked={props.selectedMac === mac}
                    onChange={() => props.onMacSelect(mac)}
                />
            </Field>
        ))}
    </div>
);

export default MacSelector;
