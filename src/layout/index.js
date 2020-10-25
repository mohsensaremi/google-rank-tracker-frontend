import React, {useState} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import {makeStyles} from '@material-ui/core/styles';
import SettingsDialog from 'modules/settings/Dialog';
import {useSendHttp} from "../utils/network/useSendHttp";
import {useMutation, useQueryCache} from "react-query";

const useStyles = makeStyles(theme => ({
    '@global': {
        'body': {
            backgroundColor: theme.palette.background.default,
        },
    },
    root: {},
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    body: {
        maxWidth: 1000,
        margin: `${theme.spacing(4)}px auto`,
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

const Layout = (props) => {

    const {
        children
    } = props;

    const classes = useStyles();

    const sendHttp = useSendHttp();
    const cache = useQueryCache();

    const [settingsDialog, setSettingsDialog] = useState({open: false});

    const [enqueueAllMutation] = useMutation(() =>
        sendHttp({
            method: "POST",
            url: "/keyword/enqueue-all",
        }), {
        throwOnError: true,
        onSuccess: () => {
            cache.invalidateQueries('/keyword/enqueue-all')
        },
    });

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Google Rank Tracker
                    </Typography>
                    <Button
                        color={"inherit"}
                        variant={"outlined"}
                        className={classes.button}
                        onClick={() => {
                            if (window.confirm('Are you sure?')) {
                                enqueueAllMutation();
                            }
                        }}
                    >
                        ENQUEUE ALL KEYWORDS
                    </Button>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="settings"
                        onClick={() => setSettingsDialog({open: true})}
                    >
                        <SettingsIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={classes.body}>
                {children}
            </div>
            <SettingsDialog
                {...settingsDialog}
                onClose={() => setSettingsDialog({open: false})}
            />
        </div>
    );

};

export default Layout;