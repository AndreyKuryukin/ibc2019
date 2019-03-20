import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import debounce from 'lodash/debounce';
import ClearableInput from '../../../../../components/ClearableInput';
import Field from '../../../../../components/Field';
import Radio from '../../../../../components/Radio';
import styles from './styles.scss';
import { SEARCH_OPTIONS, } from '../reducers';
import LocationDropdown from '../../../../dashboard/components/DashboardHead/LocationDropdown';
import * as _ from "lodash";
import ls from "i18n";

const localizeFilterOption = key => ({
    [SEARCH_OPTIONS.ALL]: ls('ALL_FIELDS', 'All'),
    [SEARCH_OPTIONS.SERVICE_ID]: 'Service ID',
    [SEARCH_OPTIONS.SAN]: 'Service Account Number',
    [SEARCH_OPTIONS.MAC]: 'MAC',
    [SEARCH_OPTIONS.NLS]: ls('NLS', 'Personal account number'),
}[key]);

class Search extends React.PureComponent {
    static propTypes = {
        searchBy: PropTypes.oneOf(Object.values(SEARCH_OPTIONS)),
        searchText: PropTypes.string,
        location: PropTypes.string,
        buildLink: PropTypes.func
    };
    static defaultProps = {
        searchBy: SEARCH_OPTIONS.ALL,
        searchText: '',
        location: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            searchBy: props.searchBy,
            searchText: props.searchText,
            location: props.location,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.searchBy !== nextProps.searchBy) {
            this.setState({
                searchBy: nextProps.searchBy,
            });
        }
        if (this.props.searchText !== nextProps.searchText) {
            this.setState({
                searchText: nextProps.searchText,
            });
        }
        if (this.props.location !== nextProps.location) {
            this.setState({
                location: nextProps.location,
            });
        }
    }

    onTextChange = debounce((searchText) => {
        this.setState({ searchText });
    }, 200);

    onOptionChange(searchBy) {
        this.setState({ searchBy });
    }

    onLocationChange = (value) => {
        const location = value === 'RUSSIA' ? null : value;
        this.setState({ location });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const query = _.pick(this.state, ['searchText', 'searchBy', 'location']);
        this.props.onSubmit(query);
    };

    render() {
        const { searchText, searchBy, location } = this.state;

        return (
            <form
                className={cn(styles.searchFilterBlock, {
                    [styles.brief]: this.props.searchText === '',
                })}
                onSubmit={this.onSubmit}
            >
                <div className={styles.searchBlock}>
                    <ClearableInput
                        className={styles.searchInput}
                        value={searchText}
                        placeholder={ls('SUBSCRIBER_CARD_SEARCH_PLACEHOLDER', 'Найти клиента')}
                        maxLength={60}
                        onChange={this.onTextChange}
                    />
                    <Button
                        color="primary"
                        className={styles.searchButton}
                        type="submit"
                    >{ls('SEARCH', 'Search')}</Button>
                </div>
                <div className={styles.filterBlock}>
                    <div>{ls('SEARCH_BY', 'Искать по')}:</div>
                    {Object.values(SEARCH_OPTIONS).map(option => (
                        <Field
                            key={option}
                            id={`${option}-filter`}
                            labelText={localizeFilterOption(option)}
                            inputWidth={20}
                            labelAlign="right"
                            splitter=""
                        >
                            <Radio
                                id={`${option}-filter`}
                                name="subscriber-search-option"
                                checked={searchBy === option}
                                onChange={() => this.onOptionChange(option)}
                            />
                        </Field>
                    ))}
                    {/*<LocationDropdown*/}
                        {/*value={location === null ? 'RUSSIA' : location}*/}
                        {/*depth={1}*/}
                        {/*onChange={this.onLocationChange}*/}
                        {/*buildLink={this.props.buildLink}*/}
                    {/*/>*/}
                </div>
            </form>
        );
    }
}


export default Search;
