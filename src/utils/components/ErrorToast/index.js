import React from 'react';
import Toast from '../Toast';

export default function ErrorToast(props) {

    const {
        message,
    } = props;

    return (Array.isArray(message) ? message : [message]).map((message, index) => (
        <Toast
            message={message}
            key={index}
            severity={"error"}
        />
    ));
}