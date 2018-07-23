/* eslint-disable */
import React from 'react';
import Draggable from 'react-draggable';

class DraggableWrapper extends React.PureComponent {
    render() {
        return (
            <Draggable
                axis="both"
                handle=".handle"
                constrain={constrain(1)}
                bound="all box"
                zIndex={100}
                defaultPosition={this.props.defaultPosition}
            >
                {this.props.children}
            </Draggable>
        );
    }
}

function constrain(snap) {
    function constrainOffset(offset, prev) {
        var delta = offset - prev;
        if (Math.abs(delta) >= snap) {
            return prev + parseInt(delta / snap, 10) * snap;
        }
        return prev;
    }

    return function (pos) {
        return {
            top: constrainOffset(pos.top, pos.prevTop),
            left: constrainOffset(pos.left, pos.prevLeft)
        };
    };
}

export default DraggableWrapper;

