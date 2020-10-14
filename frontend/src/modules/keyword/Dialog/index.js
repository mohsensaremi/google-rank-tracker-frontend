import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from 'final-form-field/TextField';
import {Field, Form} from 'react-final-form'
import {useMutation, useQueryCache} from 'react-query';
import {useSendHttp} from "../../../utils/network/useSendHttp";
import OnError from "utils/components/OnError";

const Dialog = (props) => {

    const {
        open,
        onClose,
        initialValues,
        websiteId,
    } = props;

    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    const [mutate, {error}] = useMutation((data) =>
        sendHttp({
            method: "POST",
            data: {
                ...data,
                websiteId,
            },
            url: "/keyword/submit",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/keyword/datatable')
        },
    })


    const onSubmit = async (data) => {
        try {
            await mutate(data);
            onClose();
        } catch (e) {
            console.log("e", e);
            // Uh oh, something went wrong
        }
    };

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={"xs"}
            fullWidth
        >
            {
                error && (
                    <OnError
                        error={error}
                    />
                )
            }
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Field
                                name="title"
                                component={TextField}
                                label="Keyword"
                                placeholder="Enter your keyword"
                                fullWidth
                                margin={"normal"}
                                variant={"outlined"}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant={"contained"}
                                color={"primary"}
                                type={"submit"}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                )}
            />
        </MuiDialog>
    );
};

export default Dialog;