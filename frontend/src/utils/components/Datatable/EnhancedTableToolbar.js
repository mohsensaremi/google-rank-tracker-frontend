import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";


const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {title, actions} = props;

    return (
        <Toolbar
            className={classes.root}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {title}
            </Typography>
            {actions}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;