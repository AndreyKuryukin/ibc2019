import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'reactstrap';
import ls from 'i18n';
import _ from 'lodash';
import memoize from 'memoizejs';
import Field from '../../../../../components/Field';
import Select from '../../../../../components/Select';
import styles from './styles.scss';

const mrfOptions = [{ value: 'all', title: 'Все МРФ' }];
const regionOptions = [{ value: 'all', title: 'Все регионы' }];

class GroupPoliciesControls extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onApplyFilter: PropTypes.func,
        rfOptions: PropTypes.array,
        mrfOptions: PropTypes.array,
        mrf: PropTypes.string,
        rf: PropTypes.string,
    };

    static defaultProps = {
        onSearchTextChange: () => null,
        onApplyFilter: () => null,
        rfOptions: [],
        mrfOptions: [],
        mrf: '',
        rf: '',
    };

    static mapOptions = memoize((opts) => opts.map((opt) => ({ value: opt.id, title: opt.name })));

    constructor(props) {
        super(props);

        this.state = {
            mrf: props.mrf,
            rf: props.rf,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mrf !== nextProps.mrf) {
            this.setState({ mrf: nextProps.mrf });
        }

        if (this.props.rf !== nextProps.rf) {
            this.setState({ rf: nextProps.rf });
        }
    }

    onSearchTextChange = (event) => {
        this.props.onSearchTextChange(_.get(event, 'currentTarget.value', ''));
    };

    onMrfChange = mrf => {
        this.setState({ mrf });
    };

    onRegionChange = rf => {
        this.setState({ rf });
    };

    onApplyFilter = () => {
        this.props.onApplyFilter(this.state);

        this.context.history.push({
            pathname: '/alarms/group-policies/current',
            search: `?${['mrf', 'rf'].reduce((res, key) => this.state[key] ? [...res, `${key}=${this.state[key]}`] : res, []).join('&')}`,
        });
    };

    render() {
        const { mrf, rf } = this.state;

        return (
            <div className={styles.groupPoliciesControls}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterControl}>
                        <Field
                            id="mrf-filter"
                            labelText={ls('ALARMS_GROUP_POLICIES_MRF_FILTER', 'Фильтр по МРФ')}
                            labelWidth="35%"
                            inputWidth="65%"
                        >
                            <Select
                                id="mrf-filter"
                                options={GroupPoliciesControls.mapOptions(this.props.mrfOptions)}
                                value={mrf}
                                onChange={this.onMrfChange}
                            />
                        </Field>
                    </div>
                    <div className={styles.filterControl}>
                        <Field
                            id="region-filter"
                            labelText={ls('ALARMS_GROUP_POLICIES_REGION_FILTER', 'Фильтр по региону')}
                            labelWidth="45%"
                            inputWidth="55%"
                        >
                            <Select
                                id="region-filter"
                                options={GroupPoliciesControls.mapOptions(this.props.rfOptions)}
                                value={rf}
                                onChange={this.onRegionChange}
                            />
                        </Field>
                    </div>
                    <Button className={styles.applyButton} color="action" onClick={this.onApplyFilter}>
                        {ls('ALARMS_GROUP_POLICIES_APPLY_FILTER', 'Применить')}
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