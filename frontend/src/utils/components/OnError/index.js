import React from 'react';
import ErrorToast from '../ErrorToast';

export default function OnError(props) {

    const {
        error,
    } = props;

    switch (error.kind) {
        case "ErrorWithMessage":
            return (
                <ErrorToast
                    message={error.error}
                />
            );
        default:
            return (
                <ErrorToast
                    message={"Unknown Error"}
                />
            );
    }
}