import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from 'final-form-field/TextField';
import {Field, Form} from 'react-final-form'
import {useMutation, useQuery} from 'react-query';
import {useSendHttp} from "../../../utils/network/useSendHttp";
import OnError from "utils/components/OnError";

const Dialog = (props) => {

    const {
        open,
        onClose,
    } = props;

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={"xs"}
            fullWidth
        >
            {
                open && (
                    <Component
                        onClose={onClose}
                    />
                )
            }
        </MuiDialog>
    );
};

const Component = (props) => {
    const {
        onClose,
    } = props;

    const sendHttp = useSendHttp();

    const {data} = useQuery(`/settings/get`, () =>
        sendHttp({
            method: "GET",
            url: `/settings/get`,
        })
    );
    
    const [mutate, {error}] = useMutation((data) =>
        sendHttp({
            method: "POST",
            data,
            url: "/settings/set",
        }), {
        throwOnError: true,
    });


    const onSubmit = async (data) => {
        try {
            await mutate(data)
            onClose();
        } catch (e) {
            console.log("e", e);
        }
    };

    return (

        <>
            {
                error && (
                    <OnError
                        error={error}
                    />
                )
            }
            <Form
                onSubmit={onSubmit}
                initialValues={data}
                render={({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            {
                                [
                                    {
                                        value: "browserSearchSleepSeconds",
                                        parse: x => Number(x),
                                    },
                                    {
                                        value: "browserSearchMaxPage",
                                        parse: x => Number(x),
                                    },
                                    {
                                        value: "keywordRankHistoryCount",
                                        parse: x => Number(x),
                                    },
                                ].map(x => (
                                    <Field
                                        key={x.value}
                                        name={x.value}
                                        component={TextField}
                                        label={x.label || x.value}
                                        fullWidth
                                        margin={"normal"}
                                        variant={"outlined"}
                                        parse={x.parse}
                                    />
                                ))
                            }
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
        </>
    );
}

export default Dialog;