import React, {useEffect, useMemo, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import debounce from "lodash.debounce";

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
    const {title, actions, withSearch, setConfig} = props;

    const [showSearch, setShowSearch] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const debouncedSetSearch = useMemo(() => debounce((search) => {
        setConfig({
            search,
        });
    }, 500), []);

    useEffect(() => {
        debouncedSetSearch(searchInput);
    }, [debouncedSetSearch, searchInput])

    return (
        <Toolbar
            className={classes.root}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                {title}
            </Typography>
            {
                withSearch && (
                    <>
                        {
                            showSearch ? (
                                <TextField
                                    placeholder={"Search"}
                                    variant={"outlined"}
                                    autoFocus
                                    onChange={event => setSearchInput(event.target.value)}
                                    value={searchInput}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                size={"small"}
                                                onClick={() => setShowSearch(false)}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        ),
                                    }}
                                />
                            ) : (
                                <IconButton
                                    onClick={() => setShowSearch(true)}
                                >
                                    <SearchIcon/>
                                </IconButton>
                            )
                        }
                    </>
                )
            }
            {actions}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;