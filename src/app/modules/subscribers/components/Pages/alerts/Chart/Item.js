import React from 'react';
import PropTypes from 'prop-types';
import chart from './chart.scss';
import {background} from './util';
import ItemDetails from './ItemDetails';

class Item extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        closed: PropTypes.bool.isRequired,
        from: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        data: PropTypes.object.isRequired,
        buildLink: PropTypes.func.isRequired,
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
        });
    };
    onMouseLeave = () => {
        this.timeout = setTimeout(() => {
            this.setState({
                detailsDisplayed: false,
            });
        }, 200);
    };

    render() {
        const {color, closed, from, duration} = this.props;

        const id = `alert-${this.props.id}`;

        return (
            <div
                id={id}
                className={chart.item}
                style={{
                    background: background(color, closed),
                    left: `${Math.max(0, from * 100)}%`,
                    width: `${Math.min(100, duration * 100)}%`,
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <ItemDetails
                    target={id}
                    link={this.props.buildLink({page: 'alerts', id: this.props.id})}
                    isShown={this.state.detailsDisplayed}
                    data={this.props.data}
                />
            </div>
        );
    }
}

export default Item;
