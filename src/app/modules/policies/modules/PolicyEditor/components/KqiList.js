import React from 'react';
import PropTypes from 'prop-types';
import ls from "../../../../../../i18n/index";
import * as _ from "lodash";
import ChipList from "../../../../../components/Chip/ChipList";
import Chip from "../../../../../components/Chip/Chip";

class KqiList extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
        separator: PropTypes.string,
        onChange: PropTypes.func,
        kqiList: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string
        })),
        selected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    };

    static defaultProps = {
        title: '',
        separator: ':',
        onChange: () => null,
        kqiList: []
    };

    state = {
        kqi: {},
        selected: [],
        kqiList: []
    };

    constructor(props) {
        super(props);
        this.state = {
            kqiList: props.kqiList || [],
            selected: props.selected || [],
            kqiListById: this.mapKqiById(props.kqiList)
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.selected !== this.props.selected) {
            this.setState({ selected: nextProps.selected })
        }
        if (nextProps.kqiList !== this.props.kqiList) {
            console.log(nextProps.kqiList);
            this.setState({
                kqiList: nextProps.kqiList,
                kqiListById: this.mapKqiById(nextProps.kqiList)
            })
        }
    }

    mapKqiById = kqiList => _.reduce(kqiList, (kqis, kqi) => {
        kqis[kqi.id] = kqi;
        return kqis
    }, {});

    select = (kqi) => this.setState({ kqi });

    mapOptions = (kqilist, selected) =>
        kqilist.filter(kqi => !_.find(selected, sKqi => sKqi === kqi.id))
            .map(kqi => ({
                title: kqi.name,
                value: kqi.id
            }));

    onAdd = (id) => {
        const selected = [...this.state.selected, id];
        if (_.isFunction(this.props.onChange)) {
            this.setState({ kqi: null }, () => this.props.onChange(selected));
        } else {
            this.setState({ kqi: null, selected: selected });
        }
    };

    onRemove = (kqiId) => {
        const selected = _.filter(this.state.selected, id => id !== kqiId);
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(selected);
        } else {
            this.setState({ selected: selected });
        }
    };

    render() {
        const { selected = [], kqiListById = {}, kqiList = [] } = this.state;
        return <ChipList
            id="policy-kqi-list"
            options={this.mapOptions(kqiList, selected)}
            onChange={id => this.select(kqiListById[id])}
            onAdd={(id) => this.onAdd(id)}
            valid={!this.state.error}
            error={this.state.error}
            value={_.get(this.state, 'kqi.id')}
            placeholder={ls('POLICY_KQI_LIST_PLACEHOLDER', 'Выберите KQI')}
        >
            {selected.map(kqi => <Chip title={kqiListById[kqi].name}
                                       key={kqi}
                                       onRemove={() => this.onRemove(kqi)}/>)}
        </ChipList>
    }
}

export default KqiList;
