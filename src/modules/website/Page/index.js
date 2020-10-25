import React, {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Datatable from 'utils/components/Datatable';
import {useDatatable} from "../../../utils/components/Datatable/useDatatable";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "../Dialog";
import {Link} from 'react-router-dom';
import {useMutation, useQueryCache} from "react-query";
import {useSendHttp} from "../../../utils/network/useSendHttp";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}));

const Page = () => {

    const classes = useStyles();

    const [dialog, setDialog] = useState({
        open: false,
    });

    const datatable = useDatatable('/website/datatable');
    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    const [deleteMutation] = useMutation((id) =>
        sendHttp({
            method: "POST",
            data: {
                id,
            },
            url: "/website/delete",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/website/datatable')
        },
    });

    return (
        <Paper className={classes.root}>
            <Datatable
                {...datatable}
                title={"Websites"}
                actions={(
                    <IconButton
                        onClick={() => setDialog({open: true})}
                    >
                        <AddIcon/>
                    </IconButton>
                )}
                columns={[
                    {
                        name: "website",
                    },
                    {
                        name: "actions",
                        render: (row) => (
                            <>
                                <IconButton
                                    onClick={() => setDialog({
                                        open: true,
                                        initialValues: {
                                            ...row,
                                        },
                                    })}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        if (window.confirm('Are you sure?')) {
                                            deleteMutation(row.id)
                                        }
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                                <Button
                                    color={"primary"}
                                    variant={"outlined"}
                                    component={Link}
                                    to={`/keywords/${row.id}`}
                                >
                                    MANAGE KEYWORDS
                                </Button>
                            </>
                        )
                    },
                ]}
            />
            <Dialog
                {...dialog}
                onClose={() => setDialog({open: false})}
            />
        </Paper>
    );
};

export default Page;