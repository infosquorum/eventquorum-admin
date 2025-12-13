'use client';

import type { IEventItem } from 'src/types/event';
import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {  _roles, _userList } from 'src/_mock';
import { _eventList } from 'src/_mock/_events';
import { DashboardContent } from 'src/layouts/admin';
import { _organizerList } from 'src/_mock/_organizer';

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

import { EventTableToolbar } from 'src/sections/planifierevent/event/event-table-toolbar';
import { OrganizerTableRow } from 'src/sections/planifierevent/organisateur/organizer-table-row';
import { EventTableFiltersResult } from 'src/sections/planifierevent/event/event-table-filters-result';
import { OrganizerTableToolbar } from 'src/sections/planifierevent/organisateur/organizer_table-toolbar';

import { IOrganizerItem, IOrganizerTableFilters } from 'src/types/organizer';

import { EventTableRow } from '../event-table-row';


// ----------------------------------------------------------------------

const EVENT_TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'logo', label: 'Logo', width: 70 },
    { id: 'matricule', label: 'Matricule', width: 88 },
    { id: 'name', label: 'Titre', width: 200 },
    { id: 'type', label: 'Type', width: 100 },
    { id: 'date', label: 'Periode', width: 80 },
    { id: 'nomclient', label: 'Nom Client', width: 200 },
    { id: 'status', label: 'Statut', width: 70 },
    { id: '', label: 'Action', width: 88 },
];

const ORGANIZER_TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'avatarUrl', label: '', width: 10 },
    { id: 'name', label: 'Nom & Prénoms', width: 100 },
    { id: 'email', label: 'Email', width: 120 },
    { id: 'phone', label: 'Téléphone', width: 100 },
    { id: 'status', label: 'Statut', width: 88 },
    { id: '', label: 'Action', width: 88 },
];

export const EVENT_STATUS_OPTIONS = [
    { value: 'terminé', label: 'Terminé' },
    { value: 'en cours', label: 'En Cours' },
    { value: 'non demarré', label: 'Non Demarré' },
  ];

const STATUS_OPTIONS = [{ value: 'all', label: 'Tous' }, ...EVENT_STATUS_OPTIONS];

export const PLAN_EVENT_TABS = [
    { label: 'Gérer événement', value: 'event' },
    { label: 'Gérer organisateur', value: 'organizer' },
];

interface FilterData {
    eventData: IEventItem[];
    organizerData: IOrganizerItem[];
    filters: IOrganizerTableFilters;
    comparator: (a: any, b: any) => number;
}

function applyFilter({ eventData, organizerData, filters, comparator, activeTab }: FilterData & { activeTab: string }) {
    const { name } = filters;
    const currentData = activeTab === 'event' ? eventData : organizerData;

    let filteredData = [...currentData];

    // Sort data
    const stabilizedThis = filteredData.map((el, index) => [el, index] as const);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    filteredData = stabilizedThis.map((el) => el[0]);

    // Apply filters
    if (name) {
        filteredData = filteredData.filter(
            (item) => item.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // if (status !== 'all') {
    //     filteredData = filteredData.filter((item) => item.status === status);
    // }

    // if (role && role.length) {
    //     filteredData = filteredData.filter((item) =>
    //         'role' in item && role.includes(item.role)
    //     );
    // }

    return filteredData;
}

// ----------------------------------------------------------------------

export function EventListView() {

    const table = useTable();
    const confirmDialog = useBoolean();
    const [activeTab, setActiveTab] = useState('event');
    const [eventData, setEventData] = useState<IEventItem[]>(_eventList);
    const [organizerData, setOrganizerData] = useState<IOrganizerItem[]>(_organizerList);

    const filters = useSetState<IOrganizerTableFilters>({
        name: '',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        table.onResetPage();
        filters.setState({ name: '' });
    };

    const dataFiltered = applyFilter({
        eventData,
        organizerData,
        filters: filters.state,
        comparator: getComparator(table.order, table.orderBy),
        activeTab
    });

    const paginatedData = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const handleDeleteRow = useCallback(
        (id: string) => {

            if (activeTab === 'event') {
                setEventData(prev => prev.filter(row => row.id !== id));
            } else {
                setOrganizerData(prev => prev.filter(row => row.id !== id));
            }
            toast.success('Suppression réussie!');

            table.onUpdatePageDeleteRow(paginatedData.length);
        },
        [activeTab, table, dataFiltered.length, paginatedData, setEventData, setOrganizerData]
    );

    const handleDeleteRows = useCallback(() => {
        const totalRowsFiltered = dataFiltered.length;
        const currentPageRows = paginatedData.length;

        if (activeTab === 'event') {
            setEventData(prev => prev.filter(row => !table.selected.includes(row.id)));
        } else {
            setOrganizerData(prev => prev.filter(row => !table.selected.includes(row.id)));
        }
        toast.success('Suppression réussie!');

        table.onUpdatePageDeleteRows(currentPageRows, totalRowsFiltered);
    }, [activeTab, table, dataFiltered.length, paginatedData, setEventData, setOrganizerData]);

    const canReset = !!(filters.state.name );
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const currentTableHead = activeTab === 'event' ? EVENT_TABLE_HEAD : ORGANIZER_TABLE_HEAD;

    const getAddButtonLabel = () => activeTab === 'event' ? 'Nouvel événement' : 'Nouvel organisateur';
    const getTableTitle = () => activeTab === 'event' ? 'Liste des événements' : 'Liste des organisateurs';

    return (
        <>
            <DashboardContent maxWidth="xl">
                <CustomBreadcrumbs
                    heading='Planifier un évènement'
                    action={
                        <Button
                            component={RouterLink}
                            href={(activeTab === 'event') ? paths.admin.PLANIFIER_UN_EVENEMENT.newevent : paths.admin.PLANIFIER_UN_EVENEMENT.neworganisateur}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            {getAddButtonLabel()}
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{ px: 2.5, mb: 3 }}
                    >
                        {PLAN_EVENT_TABS.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={tab.label}
                            />
                        ))}
                    </Tabs>

                    <Typography variant='h4' sx={{ mt: 3, mb: 2, pl: 5, fontSize: 20 }}>
                        {getTableTitle()}
                        <span className=' pl-1'>({dataFiltered.length})</span>
                    </Typography>

                    {activeTab === 'organizer' ?
                        (
                            <OrganizerTableToolbar
                                filters={filters}
                                onResetPage={table.onResetPage}
                            // options={{ roles: _roles }}
                            />
                        ) : (
                            <EventTableToolbar
                                filters={filters}
                                onResetPage={table.onResetPage}
                            // options={{ roles: _roles }}
                            />
                        )}

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
                                <Tooltip title="Supprimer">
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
                                    headCells={currentTableHead}
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
                                    {paginatedData.map((row) => (
                                        activeTab === 'organizer' ? (
                                            <OrganizerTableRow
                                                key={row.id}
                                                row={row as IOrganizerItem}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                editHref={paths.dashboard.user.edit(row.id)}
                                            />
                                        ) : (
                                            <EventTableRow
                                                key={row.id}
                                                row={row as IEventItem}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                editHref={paths.admin.PLANIFIER_UN_EVENEMENT.edit(row.id)}
                                                ficheClientHref={paths.admin.GESTION_CLIENT.ficheclient(row.id)}
                                                detailEventHref={paths.admin.PLANIFIER_UN_EVENEMENT.detailevenement(row.id)}
                                            />
                                        )
                                    ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 76}
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

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title="Supprimer"
                content={
                    <>
                        Êtes-vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> éléments?
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
        </>
    );
}

// ----------------------------------------------------------------------

// type ApplyFilterProps = {
//     inputData: IUserItem[];
//     filters: IUserTableFilters;
//     comparator: (a: any, b: any) => number;
// };

// function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
//     const { name, status, role } = filters;

//     const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });

//     inputData = stabilizedThis.map((el) => el[0]);

//     if (name) {
//         inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
//     }

//     if (status !== 'all') {
//         inputData = inputData.filter((user) => user.status === status);
//     }

//     if (role.length) {
//         inputData = inputData.filter((user) => role.includes(user.role));
//     }

//     return inputData;
// }