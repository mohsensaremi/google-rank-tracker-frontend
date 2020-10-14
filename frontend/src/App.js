import React from 'react';
import {createMuiTheme, ThemeProvider,} from '@material-ui/core/styles';
import WebsitePage from 'modules/website/Page';
import KeywordPage from 'modules/keyword/Page';
import Layout from 'layout';
import {queryCache, ReactQueryCacheProvider} from 'react-query';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

let theme = createMuiTheme({
    shape: {
        borderRadius: 10,
    },
});

theme = {
    ...theme,
    overrides: {
        MuiDialogActions: {
            root: {
                borderTop: `1px solid ${theme.palette.divider}`,
            },
        },
    },
}

function App() {

    return (
        <ReactQueryCacheProvider queryCache={queryCache}>
            <ThemeProvider theme={theme}>
                <Layout>
                    <Router>
                        <Switch>
                            <Route path="/keywords/:websiteId">
                                <KeywordPage/>
                            </Route>
                            <Route path="/">
                                <WebsitePage/>
                            </Route>
                        </Switch>
                    </Router>
                </Layout>
            </ThemeProvider>
        </ReactQueryCacheProvider>
    );
}

export default App;
