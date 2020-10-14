import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

function Toast(props) {

    const {
        anchorOrigin,
        message,
        severity,
    } = props;

    return (
        <Snackbar open={true} autoHideDuration={6000} anchorOrigin={anchorOrigin}>
            <Alert severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

Toast.defaultProps = {
    severity: "success",
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
}

export default Toast;