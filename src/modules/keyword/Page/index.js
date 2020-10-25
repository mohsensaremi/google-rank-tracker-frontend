import React, {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import Datatable from 'utils/components/Datatable';
import {useDatatable} from "../../../utils/components/Datatable/useDatatable";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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
    rankGreen: {
        color: green[500],
        fontWeight: "bold",
    },
    rankRed: {
        color: red[500],
        fontWeight: "bold",
    },
    lastRank2: {
        fontSize: 13,
    },
}));

const Page = () => {

    const params = useParams();

    const classes = useStyles();

    const [activeCategory, setActiveCategory] = useState("");

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

    const {data: categoriesRes} = useQuery(`/keyword/categories`, () =>
        sendHttp(({
            url: `/keyword/categories/${params.websiteId}`,
        }))
    );

    const datatable = useDatatable(`/keyword/datatable`, {
        websiteId: params.websiteId,
        category: activeCategory,
    }, {
        searchColumns: ["title", "category"]
    });

    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL, {
            path: process.env.REACT_APP_SOCKET_URL ? undefined : "/api/socket.io"
        });
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
            cache.invalidateQueries('/keyword/datatable');
            cache.invalidateQueries('/keyword/categories');
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
                withSearch
                afterToolbar={(
                    <>
                        {
                            Array.isArray(categoriesRes) && categoriesRes.length > 0 && (
                                <Tabs
                                    value={activeCategory}
                                    onChange={(event, value) => setActiveCategory(value)}
                                    variant={"fullWidth"}
                                >
                                    <Tab
                                        value={""}
                                        label={"all"}
                                    />
                                    {
                                        categoriesRes.map(c => (
                                            <Tab
                                                key={c}
                                                value={c}
                                                label={c}
                                            />
                                        ))
                                    }
                                </Tabs>
                            )
                        }
                    </>
                )}
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
                        name: "category",
                    },
                    {
                        name: "platform",
                    },
                    {
                        name: "rank",
                        render: (row) => (
                            <Grid
                                container
                                spacing={1}
                                alignItems={"center"}
                            >
                                {
                                    row.lastRank && (
                                        <Grid item>
                                            <Typography
                                                className={
                                                    (row.lastRank2 && row.lastRank && row.lastRank2 > row.lastRank)
                                                        ? classes.rankGreen
                                                        : (row.lastRank2 && row.lastRank && row.lastRank2 < row.lastRank)
                                                        ? classes.rankRed
                                                        : undefined
                                                }
                                            >
                                                {row.lastRank}
                                            </Typography>
                                        </Grid>
                                    )
                                }
                                {
                                    row.lastRank2 && (
                                        <Grid item>
                                            <Typography
                                                className={classes.lastRank2}
                                            >
                                                {`(${row.lastRank2})`}
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
                                    disabled={!!row.pendingRank}
                                >
                                    ENQUEUE
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
                                    HISTORY
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
                                    GRAPH
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
                categoriesRes={categoriesRes}
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