'use client';
'use client';

import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _eventTypes } from 'src/_mock';
import { _eventTypesList } from 'src/_mock/_events';
import { DashboardContent } from 'src/layouts/admin';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    rowInPage,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { TypeTableRow } from '../type-table-row';
import { TypeTableToolbar } from '../type-table-toolbar';
import { EventTableFiltersResult } from '../../event/event-table-filters-result';


// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'type', label: 'Type', width: 470 },
    { id: '', width: 88 },
];

export type IEventType = {
    id: string;
    name: string,
}
export type IEventTableFilters = {
    name: string,
}

export function TypeListView() {

    const table = useTable();

    const confirmDialog = useBoolean();

    const [tableData, setTableData] = useState<IEventType[]>(_eventTypesList);

    const filters = useSetState<IEventTableFilters>({ name: '' });
    const { state: currentFilters, setState: updateFilters } = filters;

    const dataFiltered = applyFilter({
        inputData: tableData,
        filters: currentFilters,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!currentFilters.name;

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleDeleteRow = useCallback(
        (id: string) => {
            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Suppression réussie!');

            setTableData(deleteRow);

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData]
    );


    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

        toast.success('Suppression réussie!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Supprimer"
            content={
                <>
                    Êtes vous sur de vouloir supprimer ces <strong> {table.selected.length} </strong> éléments ?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteRows();
                        confirmDialog.onFalse();
                    }}
                >
                    Supprimer
                </Button>
            }
        />
    );


    return (
        <>
            <DashboardContent maxWidth="xl">
                <CustomBreadcrumbs
                heading="Liste des types"
                action={
                    <Button
                        component={RouterLink}
                        href={paths.admin.PLANIFIER_UN_EVENEMENT.root}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:left-fill" />}
                    >
                        Retour
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
                <Card>
                    <Typography variant='subtitle2' sx={{ mt: 3, mb: 2, pl: 5, fontSize: 20 }}>
                        ({dataFiltered.length}) Types enregistrés
                    </Typography>

                    <TypeTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                    // options={{ roles: _roles }}
                    />

                    {canReset && (
                        <EventTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <Box sx={{ position: 'relative' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headCells={TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            dataFiltered.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <TypeTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                editHref={paths.admin.GESTION_CLIENT.edit(row.id)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Box>

                    <TablePaginationCustom
                        page={table.page}
                        dense={table.dense}
                        count={dataFiltered.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onChangeDense={table.onChangeDense}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>

            </DashboardContent>
            {renderConfirmDialog()}
        </>
    );
}
type ApplyFilterProps = {
    inputData: IEventType[];
    filters: IEventTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
    const { name } = filters;


    if (name) {
        inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
    }

    return inputData;
}