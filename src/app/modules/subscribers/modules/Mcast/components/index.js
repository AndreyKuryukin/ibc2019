import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import ls from 'i18n';
import Widget from '../../../components/Widget';
import ModeSwitcher, { MODE } from '../../../components/Pages/alerts/ModeSwitcher';
import McastGrid from './McastGrid';
import Graph from './Graph';
import Field from '../../../../../components/Field';
import Checkbox from '../../../../../components/Checkbox';
import styles from './styles.scss';
import MacSelector from '../../../components/Pages/alerts/MacSelector';

class Mcast extends React.PureComponent {
	static propTypes = {
		isLoading: PropTypes.bool.isRequired,
		mac: PropTypes.string,
        macs: PropTypes.array,
		data: PropTypes.array,
        onSelectMac: PropTypes.func,
	};

	static defaultProps = {
        mac: '',
        macs: [],
		data: [],
        onSelectMac: () => null,
	};

	state = {
		mode: MODE.CHART,
        isMacDropdownOpened: false,
	};

	renderControls = () => (
		<div className={styles.mcastControls}>
			<ModeSwitcher 
				className="blue-btn-group"
				value={this.state.mode}
				onChange={this.onTypeChange}
			/>
            {/*<div className={styles.mcastFilter}>*/}
				{/*<Field*/}
		            {/*id="mistakes-only"*/}
		            {/*labelText="Только с ошибками"*/}
		            {/*inputWidth={15}*/}
		            {/*labelAlign="right"*/}
		            {/*splitter=""*/}
		        {/*>*/}
		            {/*<Checkbox*/}
		                {/*id="mistakes-only"*/}
		                {/*checked={false}*/}
		                {/*onChange={() => null}*/}
		            {/*/>*/}
		        {/*</Field>*/}
		        {/*<Field*/}
		            {/*id="last-hundred"*/}
		            {/*labelText="Последние 100"*/}
		            {/*inputWidth={15}*/}
		            {/*labelAlign="right"*/}
		            {/*splitter=""*/}
		        {/*>*/}
		            {/*<Checkbox*/}
		                {/*id="last-hundred"*/}
		                {/*checked={false}*/}
		                {/*onChange={() => null}*/}
		            {/*/>*/}
		        {/*</Field>*/}
		        {/*<Field*/}
		            {/*id="more"*/}
		            {/*labelText="Дольше"*/}
		            {/*inputWidth={15}*/}
		            {/*labelAlign="right"*/}
		            {/*splitter=""*/}
		        {/*>*/}
		            {/*<Checkbox*/}
		                {/*id="more"*/}
		                {/*checked={false}*/}
		                {/*onChange={() => null}*/}
		            {/*/>*/}
		        {/*</Field>*/}
	        {/*</div>*/}
	        <MacSelector
				macList={this.props.macs}
				selectedMac={this.props.mac}
				onMacSelect={this.props.onSelectMac}
			/>
        </div>
	);

    toggleMacDropdown = () => {
    	this.setState({ isMacDropdownOpened: !this.state.isMacDropdownOpened });
	}

	onTypeChange = (mode) => {
		this.setState({ mode });
	};

	render() {
		return (
			<Widget
                title={ls('SUBSCRIBERS_MCAST_WIDGET_TITLE', 'История телесмотрения')}
                controls={this.renderControls()}
            >
              	{this.state.mode === MODE.GRID ? (
              		<McastGrid
						data={this.props.data}
						isLoading={this.props.isLoading}
					/>
          		) : (
          			<div className={styles.graphWrapper}>
						<Graph
							data={this.props.data}
							isLoading={this.props.isLoading}
						/>
					</div>
          		)} 
            </Widget>
		);
	}
}

export default Mcast;
