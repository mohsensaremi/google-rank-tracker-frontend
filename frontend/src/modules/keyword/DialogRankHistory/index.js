import React from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Datatable from "../../../utils/components/Datatable/EnhancedTable";
import {useDatatable} from "../../../utils/components/Datatable/useDatatable";
import {useMutation, useQueryCache} from "react-query";
import {useSendHttp} from "../../../utils/network/useSendHttp";

const Dialog = (props) => {

    const {
        open,
        onClose,
        keyword,
    } = props;

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            maxWidth={"md"}
            fullWidth
        >
            <DialogContent>
                {
                    keyword && (
                        <DatatableComponent
                            keyword={keyword}
                        />
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </MuiDialog>
    );
};

const DatatableComponent = (props) => {

    const {
        keyword,
    } = props;

    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    const [deleteMutation] = useMutation((id) =>
        sendHttp({
            method: "POST",
            data: {
                id,
            },
            url: "/keyword-rank/delete",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/keyword-rank/datatable')
        },
    });

    const datatable = useDatatable(`/keyword-rank/datatable`, {
        data: {
            keywordId: keyword ? keyword.id : null,
        },
    });

    return (
        <Datatable
            {...datatable}
            title={keyword.title}
            columns={[
                {
                    name: "state",
                },
                {
                    name: "rank",
                },
                {
                    name: "createdAtFormatted",
                    label: "time",
                },
                {
                    name: "actions",
                    render: (row) => (
                        <>
                            <IconButton
                                onClick={() => {
                                    if (window.confirm('Are you sure?')) {
                                        deleteMutation(row.id);
                                    }
                                }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </>
                    )
                },
            ]}
        />
    );
};

export default Dialog;