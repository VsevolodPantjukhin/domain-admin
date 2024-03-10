import React, { useState, useMemo } from 'react';
import { Table, Tooltip, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TableSortLabel, TablePagination, Container } from '@mui/material';
import './Listing.css';

export default function Listing({ rows, onDomainClick, ...props }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('domain');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);



    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };


    const sortedRows =
        stableSort([...rows], getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        )

    const parseUnix = unix => {
        let d = new Date(unix);
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }

    const pad = n => {
        return n < 10 ? '0' + n : n;
    }

    // console.log("sort", sortedRows)

    return (
        <Container maxWidth="xl">
            <Paper>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'domainName'}
                                        direction={orderBy === 'domainName' ? order : 'asc'}
                                        onClick={() => handleSortRequest('domainName')}
                                    >
                                        Домен
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy === 'expireDate'}
                                        direction={orderBy === 'expireDate' ? order : 'asc'}
                                        onClick={() => handleSortRequest('expireDate')}
                                    >
                                        Срок действия
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy === 'dateCreated'}
                                        direction={orderBy === 'dateCreated' ? order : 'asc'}
                                        onClick={() => handleSortRequest('dateCreated')}
                                    >
                                        Дата создания
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">Тематика</TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy === 'owner'}
                                        direction={orderBy === 'owner' ? order : 'asc'}
                                        onClick={() => handleSortRequest('owner')}
                                    >
                                        Регистратор
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderBy === 'mail'}
                                        direction={orderBy === 'mail' ? order : 'asc'}
                                        onClick={() => handleSortRequest('mail')}
                                    >
                                        Учетная запись
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedRows.map((row) => (
                                <Tooltip key={row.id} className="Tooltip-cursor" title="Редактировать" placement="bottom-start">
                                    <TableRow
                                        onClick={() => onDomainClick(row)}
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.domain}
                                        </TableCell>
                                        <TableCell align="left">{parseUnix(row.dateExpires)}</TableCell>
                                        <TableCell align="left">{parseUnix(row.dateCreated)}</TableCell>
                                        <TableCell align="left">
                                            {row.tags.map((item) => (
                                                <Chip key={item.tagId} className='Chips' label={item.label} size="small" variant="outlined" color="info" align="left" />
                                            ))}
                                        </TableCell>
                                        <TableCell align="left">{row.registrar}</TableCell>
                                        <TableCell align="left">{row.account}</TableCell>
                                    </TableRow>
                                </Tooltip>

                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}

                    onPageChange={(e, np) => setPage(np)}
                    onRowsPerPageChange={handleChangeRowsPerPage}

                />
            </Paper>
        </Container>

    );
}