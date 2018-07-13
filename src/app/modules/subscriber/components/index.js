import React from 'react';

import styles from './styles.scss';

class Subscriber extends React.PureComponent {
    render() {
        const user = this.props.user;
        return <div className={styles.subscriberContainer}>
            <h3>
                {`Текущий пользователь: ${user.first_name}  ${user.last_name}  (${user.login})`}
            </h3>
        </div>
    }
}

export default Subscriber;

