import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React from "react";

function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort, columns} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {Array.isArray(columns) && columns.map((headCell) => (
                    <TableCell
                        key={headCell.name}
                        // align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'default'}
                        // sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label || headCell.name}
                            {/*            {orderBy === headCell.id ? (*/}
                            {/*                <span className={classes.visuallyHidden}>*/}
                            {/*  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}*/}
                            {/*</span>*/}
                            {/*            ) : null}*/}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;