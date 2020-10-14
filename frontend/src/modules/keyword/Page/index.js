import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import Datatable from 'utils/components/Datatable';
import {useDatatable} from "../../../utils/components/Datatable/useDatatable";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "../Dialog";
import DialogRankHistory from "../DialogRankHistory";
import DialogRankGraph from "../DialogRankGraph";
import {useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryCache} from 'react-query';
import Button from "@material-ui/core/Button";
import {useSendHttp} from "../../../utils/network/useSendHttp";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(),
    },
}));

const Page = () => {

    const params = useParams();

    const classes = useStyles();

    const [dialog, setDialog] = useState({
        open: false,
    });

    const [dialogRankHistory, setDialogRankHistory] = useState({
        open: false,
    });

    const [dialogRankGraph, setDialogRankGraph] = useState({
        open: false,
    });

    const {data: websiteRes} = useQuery(`/website/${params.websiteId}`, () =>
        sendHttp(({
            url: `/website/${params.websiteId}`,
        }))
    );

    const datatable = useDatatable(`/keyword/datatable`, {
        data: {
            websiteId: params.websiteId,
        },
    });

    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);
        socket.on("keywordRankProcessDone", () => {
            cache.invalidateQueries('/keyword/datatable')
        });
    }, [cache]);

    const [deleteMutation] = useMutation((id) =>
        sendHttp({
            method: "POST",
            data: {
                id,
            },
            url: "/keyword/delete",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/keyword/datatable')
        },
    });


    const [enqueueMutation] = useMutation((data) =>
        sendHttp({
            method: "POST",
            data,
            url: "/keyword/enqueue",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/keyword/datatable')
        }
    });

    const onClickEnqueue = async (row) => {
        await enqueueMutation({
            id: row.id
        });
    };

    return (
        <Paper className={classes.root}>
            <Datatable
                {...datatable}
                title={`Keywords --< ${websiteRes ? websiteRes.website : ""} >--`}
                actions={(
                    <IconButton
                        onClick={() => setDialog({open: true})}
                    >
                        <AddIcon/>
                    </IconButton>
                )}
                columns={[
                    {
                        name: "title",
                        label: "keyword",
                    },
                    {
                        name: "rank",
                        render: (row) => (
                            <Grid
                                container
                                spacing={1}
                            >
                                {
                                    row.lastRank && (
                                        <Grid item>
                                            <Typography>
                                                {row.lastRank.rank}
                                            </Typography>
                                        </Grid>
                                    )
                                }
                                {
                                    row.pendingRank && (
                                        <Grid item>
                                            <CircularProgress
                                                size={16}
                                            />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        )
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
                                            deleteMutation(row.id);
                                        }
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                                <Button
                                    color={"primary"}
                                    variant={"outlined"}
                                    onClick={() => onClickEnqueue(row)}
                                    className={classes.button}
                                >
                                    ENQUEUE KEYWORD
                                </Button>
                                <Button
                                    color={"primary"}
                                    variant={"outlined"}
                                    className={classes.button}
                                    onClick={() => setDialogRankHistory({
                                        open: true,
                                        keyword: row,
                                    })}
                                >
                                    RANKS HISTORY
                                </Button>
                                <Button
                                    color={"primary"}
                                    variant={"outlined"}
                                    className={classes.button}
                                    onClick={() => setDialogRankGraph({
                                        open: true,
                                        keyword: row,
                                    })}
                                >
                                    RANKS GRAPH
                                </Button>
                            </>
                        )
                    },
                ]}
            />
            <Dialog
                {...dialog}
                onClose={() => setDialog({open: false})}
                websiteId={params.websiteId}
            />
            <DialogRankHistory
                {...dialogRankHistory}
                onClose={() => setDialogRankHistory({open: false})}
            />
            <DialogRankGraph
                {...dialogRankGraph}
                onClose={() => setDialogRankGraph({open: false})}
            />
        </Paper>
    );
};

export default Page;