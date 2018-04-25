import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import styles from './styles.scss';

const mrfOptions = [{ value: 'all', title: 'Все МРФ' }];
const regionOptions = [{ value: 'all', title: 'Все регионы' }];

class GroupPoliciesControls extends React.PureComponent {
    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onApplyFilter: PropTypes.func,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onApplyFilter: () => null,
    };

    constructor() {
        super();

        this.state = {
            mrf: '',
            region: '',
        };
    }

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value', ''));
    };

    onMrfChange = mrf => {
        this.setState({ mrf });
    };

    onRegionChange = region => {
        this.setState({ region });
    };

    onApplyFilter = () => {
        this.props.onApplyFilter(this.state);
    };

    render() {
        const { mrf, region } = this.state;

        return (
            <div className={styles.groupPoliciesControls}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterControl}>
                        <Field
                            id="mrf-filter"
                            labelText={ls('CRASHES_GROUP_POLICIES_MRF_FILTER', 'Фильтр по МРФ')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                id="mrf-filter"
                                options={mrfOptions}
                                value={mrf}
                                onChange={this.onMrfChange}
                            />
                        </Field>
                    </div>
                    <div className={styles.filterControl}>
                        <Field
                            id="region-filter"
                            labelText={ls('CRASHES_GROUP_POLICIES_REGION_FILTER', 'Фильтр по региону')}
                            labelWidth="45%"
                            inputWidth="55%"
                        >
                            <Select
                                id="region-filter"
                                options={regionOptions}
                                value={region}
                                onChange={this.onRegionChange}
                            />
                        </Field>
                    </div>
                    <Button className={styles.applyButton} color="action" onClick={this.onApplyFilter}>
                        {ls('CRASHES_GROUP_POLICIES_APPLY_FILTER', 'Применить')}
                    </Button>
                </div>
                <Input
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                    className={styles.search}
                    onChange={this.onSearchTextChange}
                />
            </div>
        );
    }
}

export default GroupPoliciesControls;