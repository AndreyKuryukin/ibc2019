import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FormFeedback from "../FormFeedback";
import { ERROR } from "../../costants/errors";


class ErrorWrapper extends React.PureComponent {
    static propTypes = {
        errors: PropTypes.array,
        errorAlign: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
    };

    static defaultProps = {
        errors: [],
    };

    markInvalid = (child, error, key) => {
        const result = [];
        result.push({...child, props: {...child.props, valid: false}});
        if (error[ERROR.TITLE]) {
            const errorText = <FormFeedback key={`feedback-${key}`}>
                {error[ERROR.TITLE]}
            </FormFeedback>;
            result.push(errorText);
        }
        return result
    };

    remapChildren = (children = [], errors = []) => _.reduce(children, (remapedChildren, child) => {
        const childName = _.get(child, 'props.name', '');
        const errorIndex = errors.findIndex(error => error[ERROR.TARGET] === childName);
        if (errorIndex !== -1) {
            remapedChildren.push(...this.markInvalid(child, errors[errorIndex], childName))
        } else {
            remapedChildren.push(Object.freeze(child));
        }
        return remapedChildren
    }, []);


    render() {
        const { children, errors, ...props } = this.props;
        return <div {...props}>
            {this.remapChildren(children, errors)}
        </div>
    }
}

export default ErrorWrapper;
