import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from 'final-form-field/TextField';
import SelectField from 'final-form-field/SelectField';
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
        categoriesRes,
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
            cache.invalidateQueries('/keyword/datatable');
            cache.invalidateQueries('/keyword/categories');
        },
    })


    const onSubmit = async (data) => {
        try {
            let submitData = {
                ...data,
                category: data.category === "addNewCategory"
                    ? data.newCategory
                    : data.category,
            }
            await mutate(submitData);
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
                initialValues={{
                    platform: "desktop",
                    ...(initialValues || {})
                }}
                render={({handleSubmit, values}) => {
                    const {category} = values || {};
                    return (
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
                                <Field
                                    name="platform"
                                    component={SelectField}
                                    fullWidth
                                    margin={"normal"}
                                    variant={"outlined"}
                                    label="Platform"
                                >
                                    {
                                        [
                                            {value: "desktop"},
                                            {value: "mobile"},
                                        ].map(x => (
                                            <MenuItem key={x.value} value={x.value}>
                                                {x.value}
                                            </MenuItem>
                                        ))
                                    }
                                </Field>
                                <Field
                                    name="category"
                                    component={SelectField}
                                    fullWidth
                                    margin={"normal"}
                                    variant={"outlined"}
                                    label="Category (optional)"
                                >
                                    {
                                        (categoriesRes || []).map(x => (
                                            <MenuItem key={x} value={x}>
                                                {x}
                                            </MenuItem>
                                        ))
                                    }
                                    <MenuItem value={"addNewCategory"}>
                                        Add new category
                                    </MenuItem>
                                </Field>
                                {
                                    category === "addNewCategory" && (
                                        <Field
                                            name="newCategory"
                                            component={TextField}
                                            label="New Category"
                                            placeholder="Enter category name"
                                            fullWidth
                                            margin={"normal"}
                                            variant={"outlined"}
                                            autoFocus
                                        />
                                    )
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
                    )
                }}
            />
        </MuiDialog>
    );
};

export default Dialog;