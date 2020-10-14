import {compose, flattenProp} from 'recompose';

export const finalFormFactory = (WrappedComponent) => compose(
    flattenProp('input'),
)(WrappedComponent);