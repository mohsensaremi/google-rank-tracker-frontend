import {compose, flattenProp, withProps} from 'recompose';

export const finalFormFactory = (WrappedComponent) => compose(
    flattenProp('input'),
    withProps({input: undefined}),
)(WrappedComponent);