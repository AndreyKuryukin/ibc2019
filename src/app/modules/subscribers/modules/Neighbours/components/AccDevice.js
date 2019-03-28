import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import styles from './styles.scss';
import { createKRenderer } from '../../../helpers';

const KABRenderer = createKRenderer(95);

const AccDevice = ({ accDevice }) => {
    const previousKab = _.get(accDevice.value, '1.common', null);
    const currentKab = _.get(accDevice.value, '0.common', null);

    return (
        <div className={styles.accDeviceInfo}>
            <div className={styles.accDeviceTitle}>
                <div className={styles.title}>{ls('SUBSCRIBERS_ACC_DEVICE_TITLE', 'Оборудование доступа')}</div>
                <div className={styles.kab}>
                    <span>
                        {'KQI'}<sub>sub</sub>:
                    </span>
                    {' '}
                    {KABRenderer(currentKab, previousKab)}
                </div>
            </div>
            <div className={styles.accDeviceParams}>
                <div className={styles.param}>
                    <div className={styles.name}>Name:</div>
                    <div className={styles.value}>{accDevice ? accDevice.name : ''}</div>
                </div>
                <div className={styles.param}>
                    <div className={styles.name}>Vendor:</div>
                    <div className={styles.value}>{accDevice ? accDevice.vendor : ''}</div>
                </div>
                <div className={styles.param}>
                    <div className={styles.name}>Model:</div>
                    <div className={styles.value}>{accDevice ? accDevice.model : ''}</div>
                </div>
                <div className={styles.param}>
                    <div className={styles.name}>Firmware:</div>
                    <div className={styles.value}>-</div>
                </div>
            </div>
        </div>
    );
};

export default AccDevice;
