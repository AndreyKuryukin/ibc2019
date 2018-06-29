import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import styles from '../styles.scss';

const DEFAULT_RIGHT = -3;
const draggablePosition = { x: 0 };

class Resizer extends React.PureComponent {
    static propTypes = {
        onResizeEnd: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            right: DEFAULT_RIGHT,
        };
    }

    onDrag = (event, data) => {
        if (data.x === 0) return;
        const bounds = {
            left: Math.round(this.resizer.parentElement.getBoundingClientRect().left) + 10,
            right: Math.floor(this.resizer.parentElement.nextElementSibling.getBoundingClientRect().right) - 10,
        };

        if (event.pageX < bounds.right && event.pageX > bounds.left) {
            this.setState({ right: DEFAULT_RIGHT - data.x });
        }
    }

    onStop = (event, data) => {
        this.setState({ right: DEFAULT_RIGHT });

        this.props.onResizeEnd(data.x);
    }

    onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        return (
            <Draggable
                axis="x"
                onDrag={this.onDrag}
                onStop={this.onStop}
                position={draggablePosition}
            >
                <div
                    ref={resizer => this.resizer = resizer}
                    className={styles.resizer}
                    onClick={this.onClick}
                    style={{ right: this.state.right }}
                />
            </Draggable>
        );
    }
}

export default Resizer;
