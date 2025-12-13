import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { TableCell, TableRow, TableHead, Stack, Checkbox } from '@mui/material';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';


// Types
interface Evenement {
    id: string;
    nom: string;
}

interface Organisateur {
    id: string;
    nom_prenoms: string;
    email: string;
    telephone: string;
    evenements: Evenement[];
    statut: 'actif' | 'suspendu';
}

interface OrganisateurFilters {
    nom_prenoms: string;
    statut: 'tous' | 'actif' | 'suspendu';
    evenement: string;
}

const TABLE_HEAD = [
    { id: 'nom_prenoms', label: 'Nom et Prénoms' },
    { id: 'email', label: 'Email', width: 180 },
    { id: 'telephone', label: 'Téléphone', width: 200 },
    { id: 'evenements', label: 'Événements', width: 200 },
    { id: 'statut', label: 'Statut', width: 180 },
];

const STATUS_OPTIONS = [
    { value: 'tous', label: 'Tous' },
    { value: 'actif', label: 'Actif' },
    { value: 'suspendu', label: 'Suspendu' },
];


// Données mockées
const MOCK_ORGANISATEURS: Organisateur[] = [
    {
        id: '1',
        nom_prenoms: "Jean Dupont",
        email: "jean.dupont@email.com",
        telephone: "+33 6 12 34 56 78",
        evenements: [{ id: '1', nom: "Festival de Jazz" }, { id: '2', nom: "Concert Rock" }],
        statut: "actif"
    },
    {
        id: '2',
        nom_prenoms: "Marie Martin",
        email: "marie.martin@email.com",
        telephone: "+33 6 23 45 67 89",
        evenements: [{ id: '3', nom: "Exposition d'Art" }],
        statut: "actif"
    },
    {
        id: '3',
        nom_prenoms: "Pierre Durand",
        email: "pierre.durand@email.com",
        telephone: "+33 6 34 56 78 90",
        evenements: [{ id: '4', nom: "Théâtre en plein air" }, { id: '5', nom: "Spectacle de Danse" }],
        statut: "suspendu"
    },
    {
        id: '4',
        nom_prenoms: "Sophie Bernard",
        email: "sophie.bernard@email.com",
        telephone: "+33 6 45 67 89 01",
        evenements: [{ id: '6', nom: "Concert Classique" }],
        statut: "actif"
    },
    {
        id: '5',
        nom_prenoms: "Luc Petit",
        email: "luc.petit@email.com",
        telephone: "+33 6 56 78 90 12",
        evenements: [{ id: '7', nom: "Festival de Cinéma" }],
        statut: "actif"
    },
    {
        id: '6',
        nom_prenoms: "Anne Richard",
        email: "anne.richard@email.com",
        telephone: "+33 6 67 89 01 23",
        evenements: [{ id: '8', nom: "Salon du Livre" }, { id: '9', nom: "Conférence Littéraire" }],
        statut: "suspendu"
    },
    {
        id: '7',
        nom_prenoms: "Thomas Michel",
        email: "thomas.michel@email.com",
        telephone: "+33 6 78 90 12 34",
        evenements: [{ id: '10', nom: "Festival de Street Art" }],
        statut: "actif"
    }
];


export function FicheClientOrganisateur() {
    const table = useTable();
    const confirmDialog = useBoolean();
    const menuActions = useBoolean();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [tableData, setTableData] = useState<Organisateur[]>(MOCK_ORGANISATEURS);

    const UNIQUE_EVENTS = Array.from(
        new Set(
            tableData.flatMap(organisateur =>
                organisateur.evenements.map(event => event.nom)
            )
        )
    ).sort();

    const [filters, setFilters] = useState<OrganisateurFilters>({
        nom_prenoms: '',
        statut: 'tous',
        evenement: '',
    });

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const notFound = !dataFiltered.length;

    const handleDeleteRow = useCallback(
        (id: string) => {
            const deleteRow = tableData.filter((row) => row.id !== id);
            setTableData(deleteRow);
            toast.success('Suppression réussie!');
        },
        [tableData]
    );

    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            table.onResetPage();
            setFilters(prev => ({
                ...prev,
                nom_prenoms: event.target.value
            }));
        },
        [table]
    );

    const handleFilterStatus = useCallback(
        (event: SelectChangeEvent<OrganisateurFilters['statut']>) => {
            table.onResetPage();
            setFilters(prev => ({
                ...prev,
                statut: event.target.value as OrganisateurFilters['statut']
            }));
        },
        [table]
    );

    const handleFilterEvent = useCallback(
        (event: SelectChangeEvent<string>) => {
            table.onResetPage();
            setFilters(prev => ({
                ...prev,
                evenement: event.target.value
            }));
        },
        [table]
    );

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        menuActions.onTrue();
    };

    const handleExportPDF = () => {
        // Implement PDF export logic
        console.log('Exporting to PDF...');
        menuActions.onFalse();
    };

    const handleExportExcel = () => {
        // Implement Excel export logic
        console.log('Exporting to Excel...');
        menuActions.onFalse();
    };

    return (
        <Card>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4">
                    Liste des organisateurs ({dataFiltered.length})
                </Typography>

                <Box
                    sx={{
                        mt: 3,
                        gap: 2,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    <FormControl sx={{ width: { xs: 1, md: 240 } }}>
                        <InputLabel>Statut</InputLabel>
                        <Select
                            value={filters.statut}
                            onChange={handleFilterStatus}
                            label="Statut"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: { xs: 1, md: 240 } }}>
                        <InputLabel>Événement</InputLabel>
                        <Select
                            value={filters.evenement}
                            onChange={handleFilterEvent}
                            label="Événement"
                        >
                            <MenuItem value="">Tous les événements</MenuItem>
                            {UNIQUE_EVENTS.map((eventName) => (
                                <MenuItem key={eventName} value={eventName}>
                                    {eventName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Stack direction={'row'} spacing={1}>
                        <TextField
                            // fullWidth
                            value={filters.nom_prenoms}
                            onChange={handleFilterName}
                            placeholder="Rechercher un organisateur..."
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ width: {xs: 260 , sm: 380 ,md: 440, xl: 600} }}
                        />

                        <IconButton
                            onClick={handleOpenMenu}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>

            <CustomPopover
                open={menuActions.value}
                anchorEl={anchorEl}
                onClose={menuActions.onFalse}
            >
                <MenuItem onClick={handleExportPDF}>
                    <Iconify icon="solar:printer-minimalistic-bold" />
                    Imprimer (PDF)
                </MenuItem>
                <MenuItem onClick={handleExportExcel}>
                    <Iconify icon="solar:export-bold" />
                    Exporter (EXCEL)
                </MenuItem>
            </CustomPopover>

            <Box sx={{ position: 'relative' }}>

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
                                    <TableRow
                                        key={row.id}
                                        hover
                                        selected={table.selected.includes(row.id)}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={table.selected.includes(row.id)}
                                                onClick={() => table.onSelectRow(row.id)}
                                            />
                                        </TableCell>

                                        <TableCell>{row.nom_prenoms}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.telephone}</TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {row.evenements.map((event) => (
                                                    <Label
                                                        key={event.id}
                                                        variant="soft"
                                                        color="primary"
                                                    >
                                                        {event.nom}
                                                    </Label>
                                                ))}
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Label
                                                variant="soft"
                                                color={row.statut === 'actif' ? 'success' : 'error'}
                                            >
                                                {row.statut}
                                            </Label>
                                        </TableCell>
                                    </TableRow>
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
                rowsPerPage={table.rowsPerPage}
                count={dataFiltered.length}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                onChangeDense={table.onChangeDense}
            />

        </Card>
    );
}

function applyFilter({
    inputData,
    comparator,
    filters,
}: {
    inputData: Organisateur[];
    comparator: (a: any, b: any) => number;
    filters: OrganisateurFilters;
}) {
    const { nom_prenoms, statut, evenement } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (nom_prenoms) {
        inputData = inputData.filter(
            (item) => item.nom_prenoms.toLowerCase().indexOf(nom_prenoms.toLowerCase()) !== -1
        );
    }

    if (statut !== 'tous') {
        inputData = inputData.filter((item) => item.statut === statut);
    }

    if (evenement) {
        inputData = inputData.filter((item) =>
            item.evenements.some(event => event.nom === evenement)
        );
    }

    return inputData;
}