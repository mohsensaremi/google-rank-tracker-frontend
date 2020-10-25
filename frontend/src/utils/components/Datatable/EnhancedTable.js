import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from "./EnhancedTableHead";
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function EnhancedTable(props) {

    const {
        columns,
        config,
        setConfig,
        title,
        actions,
        data,
        isLoading,
        afterToolbar,
    } = props;

    const rows = data && data.data ? data.data : []

    const {
        skip,
        limit,
        // search,
        order,
        orderBy,
    } = config;

    const classes = useStyles();

    const page = Math.floor(skip / limit);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setConfig({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property,
        });
    };

    const handleChangePage = (event, newPage) => {
        // setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setConfig({
            limit: parseInt(event.target.value, 10),
            skip: 0,
        })
    };

    // const emptyRows = limit - Math.min(limit, (rows || []).length - page * limit);

    return (
        <div className={classes.root}>
            <EnhancedTableToolbar
                title={title}
                actions={actions}
            />
            {afterToolbar}
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"medium"}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        columns={columns}
                    />
                    <TableBody>
                        {
                            isLoading ? (
                                <>
                                    {
                                        [...Array(5)].map((_, index) => (
                                            <TableRow
                                                tabIndex={-1}
                                                key={index}
                                            >
                                                {
                                                    Array.isArray(columns) && columns.map(col => (
                                                        <TableCell
                                                            key={col.name}
                                                            component="td"
                                                            scope="row"
                                                            // padding="none"
                                                        >
                                                            <Skeleton animation="wave" width={60}/>
                                                        </TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        Array.isArray(rows) && rows.map((row) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={row.name}
                                                >
                                                    {
                                                        Array.isArray(columns) && columns.map(col => (
                                                            <TableCell
                                                                key={col.name}
                                                                component="td"
                                                                scope="row"
                                                                // padding="none"
                                                            >
                                                                {typeof col.render === "function" ? col.render(row) : row[col.name]}
                                                            </TableCell>
                                                        ))
                                                    }
                                                </TableRow>
                                            );
                                        })
                                    }
                                </>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100, 200]}
                component="div"
                count={(rows || []).length}
                rowsPerPage={limit}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
}