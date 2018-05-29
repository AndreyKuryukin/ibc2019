import React from 'react';

import styles from './styles.scss';

class Dasboard extends React.PureComponent {

    render() {
        const { history, match } = this.props;
        const { params = {} } = match;

        return <div className={styles.dasboardPage}>
            <h3>Рабочий стол</h3>
        </div>
    }
}

export default Dasboard;
