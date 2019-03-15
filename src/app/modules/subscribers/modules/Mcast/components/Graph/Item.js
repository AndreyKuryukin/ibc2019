import React from 'react';
import PropTypes from 'prop-types';
import chartStyles from '../../../../components/Pages/alerts/Chart/chart.scss';
import ItemDetails from './ItemDetails';

class Item extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        from: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        data: PropTypes.shape({
            channel_name: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
            endTime: PropTypes.number,
            kab: PropTypes.string.isRequired,
        }),
        color: PropTypes.string.isRequired,
        isAlert: PropTypes.bool,
        children: PropTypes.node,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        isAlert: false,
        onMouseEnter: () => null,
        onMouseLeave: () => null,
    };

    state = {
        detailsDisplayed: false,
    };

    timeout = null;

    onMouseEnter = () => {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.setState({
            detailsDisplayed: true,
        }, this.props.onMouseEnter);
    };
    onMouseLeave = () => {
        this.timeout = setTimeout(() => {
            this.setState({
                detailsDisplayed: false,
            });
        }, 200);
        this.props.onMouseLeave();
    };

    render() {
        const { from, duration, isAlert, children, color, ...rest } = this.props;

        const id = `alert-${rest.id}`.replace(/[\s.#!]+/g, '_');

        return (
            <div
                id={id}
                className={chartStyles.item}
                style={{
                    background: isAlert ? '#ff0000' : (color || '#377dc4'),
                    left: `${Math.max(0, from * 100)}%`,
                    width: `${Math.min(100, duration * 100)}%`,
                }}
                onMouseEnter={this.props.data ? this.onMouseEnter : null}
                onMouseLeave={this.props.data ? this.onMouseLeave : null}
            >
                {children}
                {this.props.data && <ItemDetails
                    target={id}
                    isShown={this.state.detailsDisplayed}
                    data={this.props.data}
                />}
            </div>
        );
    }
}

export default Item;
