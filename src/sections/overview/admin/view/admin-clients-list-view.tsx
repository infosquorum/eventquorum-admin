'use client';

import type { Customer } from 'src/lib/customers/types';
import type { TableHeadCellProps } from 'src/components/table';

import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// import { _clientList } from 'src/_mock/_client';
import  Loading from 'src/app/loading';
import { _clientList } from 'src/_mock/_client';
import { DashboardContent } from 'src/layouts/admin';
// ✨ NOUVEAU : Imports pour API
import { customerService } from 'src/lib/customers/service';
import { archiveCustomer } from 'src/lib/customers/actions';

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

import { ClientTableRow } from 'src/sections/gestionclient/client-table-row';
import { ClientTableToolbar } from 'src/sections/gestionclient/client-table-toolbar';
import { ClientTableFiltersResult } from 'src/sections/gestionclient/client-table-filters-result';

import { IClientItem, IClientTableFilters } from 'src/types/client';

// ----------------------------------------------------------------------


const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'logo', label: 'Logo', width: 10 },
    { id: 'company_name', label: 'Nom / Raison sociale', width: 180 },
    { id: 'phoneNumber', label: 'Telephone', width: 180 },
    { id: 'creationDate', label: 'Date de création', width: 70 },
    { id: 'eventNumber', label: 'Nbre evenements', width: 60 },
    { id: 'action', label: 'Action', width: 88 },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

/**
 * Convertir les données API backend → Format UI frontend
 */
/**
 * Convertir Customer API → IClientItem UI
 * OPTIMISÉ : Utilise directement les données de la liste (pas de getById)
 */
function convertCustomerToClientItem(customer: Customer): IClientItem {
    const isPhysical = customer.type === 'Physical';
    const isLegal = customer.type === 'Legal';

    return {
        id: customer.id,
        company_name: customer.name, // L'API retourne déjà le nom formaté
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        creationDate: customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString('fr-FR')
            : '',
        eventNumber: 0, // TODO: Récupérer depuis API Events
        logo: customer.image || '/assets/icons/files/ic-folder.svg',
        personLogo: customer.image || '/assets/icons/files/ic-folder.svg',
        isMoralePerson: isLegal,

        // ✨ Champs non disponibles dans la liste : valeurs par défaut
        address: '', // Disponible uniquement dans le détail
        contact_name: '', // Disponible uniquement dans le détail
        contact_firstname: '', // Disponible uniquement dans le détail
        num_identification: '', // Disponible uniquement dans le détail
    };
}

export function AdminClientListView() {
    const table = useTable();
    const confirmDialog = useBoolean();
    const [isDeleting, setIsDeleting] = useState(false);

    // ✨ États API
    const [tableData, setTableData] = useState<IClientItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);

    const filters = useSetState<IClientTableFilters>({ company_name: '' });
    const { state: currentFilters, setState: updateFilters } = filters;

    // ✅ Fonction de chargement optimisée
    const loadCustomers = useCallback(async (page: number, pageSize: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await customerService.getAll({
                page: page + 1, // API commence à 1, Material-UI à 0
                pageSize,
            });

            const clientItems = response.items.map(customer =>
                convertCustomerToClientItem(customer)
            );

            setTableData(clientItems);
            setTotalItems(response.totalItems);
        } catch (err) {
            console.error('Erreur chargement customers:', err);
            setError('Erreur lors du chargement des clients');
            toast.error('Erreur lors du chargement des clients');
        } finally {
            setIsLoading(false);
        }
    }, []);



    // ✅ Charger au montage et quand pagination change
    useEffect(() => {
        loadCustomers(table.page, table.rowsPerPage);
    }, [loadCustomers, table.page, table.rowsPerPage]);



    // ✅ Handler changement de page
    const handlePageChange = useCallback(
        (_event: unknown, newPage: number) => {
            table.setPage(newPage);
        },
        [table]
    );

    // ✅ Handler changement rowsPerPage
    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            table.setPage(0);
            table.setRowsPerPage(newRowsPerPage);
        },
        [table]
    );


    //--------------------------------------------------------------------------------------



    // // ✨ MODIFIÉ : Filtrage uniquement côté client (les données sont déjà paginées par l'API)
    // const dataFiltered = applyFilter({
    //     inputData: tableData,
    //     comparator: getComparator(table.order, table.orderBy),
    //     filters: currentFilters,
    // });

    // // ✨ MODIFIÉ : Pas besoin de rowInPage car l'API pagine déjà
    // const dataInPage = dataFiltered;

    // ✅ OPTIMISÉ : Mémoïsation du filtrage pour éviter recalculs
    const dataFiltered = useMemo(
        () => applyFilter({
            inputData: tableData,
            comparator: getComparator(table.order, table.orderBy),
            filters: currentFilters,
        }),
        [tableData, table.order, table.orderBy, currentFilters]
    );

    const dataInPage = dataFiltered;

    const canReset =
        !!currentFilters.company_name;

    const notFound = useMemo(
        () => (!dataFiltered.length && canReset) || !dataFiltered.length,
        [dataFiltered.length, canReset]
    );



    // const handleDeleteRow = useCallback(
    //     (id: string) => {
    //         const deleteRow = tableData.filter((row) => row.id !== id);

    //         toast.success('Suppression reussie!');

    //         setTableData(deleteRow);

    //         table.onUpdatePageDeleteRow(dataInPage.length);
    //     },
    //     [dataInPage.length, table, tableData]
    // );


    // ✨ MODIFIÉ : Suppression via API
    const handleDeleteRow = useCallback(
        async (id: string) => {
            try {
                const result = await archiveCustomer(id);

                if (result?.error) {
                    toast.error(result.error);
                    return;
                }

                const deleteRow = tableData.filter((row) => row.id !== id);
                setTableData(deleteRow);
                toast.success('Suppression réussie !');
                table.onUpdatePageDeleteRow(dataInPage.length);
            } catch (err) {
                console.error('Erreur suppression:', err);
                toast.error('Erreur lors de la suppression');
            }
        },
        [table, tableData]
    );

    //--------------------------------------------------------------------------------------

    // ✨ MODIFIÉ : Suppression multiple via API
    const handleDeleteRows = useCallback(async () => {
        setIsDeleting(true);
        try {
            // Supprimer tous les customers sélectionnés
            const deletePromises = table.selected.map(async (id) => {
                try {
                    const result = await archiveCustomer(id);
                    return { id, success: !result?.error, error: result?.error };
                } catch (err) {
                    return { id, success: false, error: 'Erreur de suppression' };
                }
            });

            const results = await Promise.all(deletePromises);

            // Compter les succès et échecs
            const successes = results.filter(r => r.success);
            const failures = results.filter(r => !r.success);

            // Retirer UNIQUEMENT les clients supprimés avec succès
            const successIds = successes.map(r => r.id);
            const deleteRows = tableData.filter((row) => !successIds.includes(row.id));
            setTableData(deleteRows);

            // Afficher le message approprié
            if (failures.length === 0) {
                // Tout s'est bien passé
                toast.success(`${successes.length} client(s) supprimé(s)`);
            } else if (successes.length === 0) {
                // Tout a échoué
                toast.error('Échec de la suppression');
            } else {
                // Succès partiel
                toast.warning(
                    `${successes.length} client(s) supprimé(s), ${failures.length} erreur(s)`
                );
            }

            table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
        } catch (err) {
            console.error('Erreur suppression multiple:', err);
            toast.error('Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    }, [table, tableData]);
    //--------------------------------------------------------------------------------------

    // const handleDeleteRows = useCallback(() => {
    //     const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    //     toast.success('Suppression reussie');

    //     setTableData(deleteRows);

    //     table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    // }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Supprimer"
            content={
                <>
                    Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> client(s) ?
                </>
            }
            action={
                <LoadingButton
                    variant="contained"
                    color="error"
                    loading={isDeleting}
                    onClick={async () => {
                        await handleDeleteRows();
                        if (!isDeleting) {
                            confirmDialog.onFalse();
                        }
                    }}
                >
                    Supprimer
                </LoadingButton>
            }
        />
    );

    // ✨ NOUVEAU : Affichage loading
    if (isLoading) {
        return (
            <DashboardContent maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <Loading />
                </Box>
            </DashboardContent>
        );
    }

    // ✨ NOUVEAU : Affichage erreur
    if (error) {
        return (
            <DashboardContent maxWidth="xl">
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Réessayer
                    </Button>
                </Box>
            </DashboardContent>
        );
    }

    return (
        <>
            <DashboardContent maxWidth="xl">
                <CustomBreadcrumbs
                    heading={`Liste des clients (${totalItems})`}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.admin.GESTION_CLIENT.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Nouveau client
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    {/* <Typography variant='subtitle2' sx={{ mt: 3, mb: 2, pl: 5, fontSize: 20 }}>
                        {dataFiltered.length} Clients enregistrés
                    </Typography> */}

                    <ClientTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                    // options={{ roles: _roles }}
                    />

                    {canReset && (
                        <ClientTableFiltersResult
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
                                    {dataFiltered.map((row) => (
                                        // ✨ Pas besoin de .slice() car l'API pagine déjà
                                        <ClientTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(row.id)}
                                            onSelectRow={() => table.onSelectRow(row.id)}
                                            onDeleteRow={() => handleDeleteRow(row.id)}
                                            editHref={paths.admin.GESTION_CLIENT.edit(row.id)}
                                            viewHref={paths.admin.GESTION_CLIENT.ficheclient(row.id)}
                                        // editHref={paths.admin.GESTION_CLIENT.edit(row.id)}
                                        />
                                    ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={0}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Box>

                    <TablePaginationCustom
                        page={table.page}
                        dense={table.dense}
                        count={totalItems}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={handlePageChange}
                        onChangeDense={table.onChangeDense}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </DashboardContent>

            {renderConfirmDialog()}
        </>
    );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
    inputData: IClientItem[];
    filters: IClientTableFilters;
    comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
    const { company_name } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (company_name) {
        inputData = inputData.filter((user) => user.company_name.toLowerCase().includes(company_name.toLowerCase()));
    }

    // if (status !== 'all') {
    //     inputData = inputData.filter((user) => user.status === status);
    // }

    // if (role.length) {
    //     inputData = inputData.filter((user) => role.includes(user.role));
    // }

    return inputData;
}