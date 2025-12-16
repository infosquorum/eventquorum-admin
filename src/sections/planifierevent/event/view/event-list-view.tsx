'use client';

import type { IEventItem } from 'src/types/event';
import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';

// ✅ IMPORTS DU SERVICE ET ACTIONS ORGANIZER
import { organizerService } from 'src/lib/organizers/service';
import { deleteOrganizer, suspendOrganizer, unsuspendOrganizer } from 'src/lib/organizers/actions';
import type { Organizer } from 'src/lib/organizers/types';

// ✅ IMPORTS DU SERVICE ET ACTIONS EVENT (sans suspend/unsuspend)
import { eventService } from 'src/lib/events/service';
import { deleteEvent } from 'src/lib/events/actions'; // ← Retrait suspend/unsuspend
import type { Event } from 'src/lib/events/types';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
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
import { IEventTableFilters } from 'src/types/event';

import { EventTableRow } from '../event-table-row';

// ----------------------------------------------------------------------

const EVENT_TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'logo', label: 'Logo', width: 70 },
    { id: 'matricule', label: 'Matricule', width: 88 },
    { id: 'name', label: 'Titre', width: 200 },
    { id: 'type', label: 'Type', width: 100 },
    { id: 'date', label: 'Periode', width: 120 },
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
    { value: 'NotStarted', label: 'Non démarré' },
    { value: 'InProgress', label: 'En Cours' },
    { value: 'Suspended', label: 'Suspendu' },
    { value: 'Finished', label: 'Terminé' },
];

const STATUS_OPTIONS = [{ value: 'all', label: 'Tous' }, ...EVENT_STATUS_OPTIONS];

export const PLAN_EVENT_TABS = [
    { label: 'Gérer événement', value: 'event' },
    { label: 'Gérer organisateur', value: 'organizer' },
];

// ----------------------------------------------------------------------

/**
 * Fonction de filtrage LOCAL (pour les organisateurs)
 */
function applyOrganizerFilter({
    organizerData,
    filters,
}: {
    organizerData: IOrganizerItem[];
    filters: IOrganizerTableFilters;
}) {
    const { name } = filters;

    let filteredData = organizerData;

    if (name) {
        const searchTerm = name.toLowerCase();
        filteredData = filteredData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm) ||
            item.phoneNumber.toLowerCase().includes(searchTerm)
        );
    }

    return filteredData.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fonction de filtrage LOCAL (pour les événements)
 */
function applyEventFilter({
    eventData,
    filters,
}: {
    eventData: IEventItem[];
    filters: IEventTableFilters;
}) {
    const { name } = filters;

    let filteredData = eventData;

    if (name) {
        const searchTerm = name.toLowerCase();
        filteredData = filteredData.filter((item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.nomclient.toLowerCase().includes(searchTerm) ||
            item.matricule.toLowerCase().includes(searchTerm)
        );
    }

    // Tri par date de début (plus récent en premier)
    return filteredData.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return dateB.getTime() - dateA.getTime();
    });
}

// ----------------------------------------------------------------------

export function EventListView() {
    const table = useTable();
    const confirm = useBoolean();

    const [activeTab, setActiveTab] = useState('event');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTAT POUR LES ÉVÉNEMENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [eventData, setEventData] = useState<Event[]>([]);
    const [eventTotalCount, setEventTotalCount] = useState(0);
    const [eventLoading, setEventLoading] = useState(false);
    const [eventError, setEventError] = useState<string | null>(null);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTAT POUR LES ORGANISATEURS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [organizerData, setOrganizerData] = useState<Organizer[]>([]);
    const [organizerTotalCount, setOrganizerTotalCount] = useState(0);
    const [organizerLoading, setOrganizerLoading] = useState(false);
    const [organizerError, setOrganizerError] = useState<string | null>(null);

    const filters = useSetState<IEventTableFilters>({
        name: '',
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📖 CHARGEMENT DES ÉVÉNEMENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const loadEvents = useCallback(async () => {
        try {
            setEventLoading(true);
            setEventError(null);

            console.log('🔵 Chargement des events...', {
                page: table.page + 1,
                pageSize: table.rowsPerPage
            });

            const response = await eventService.getAll({
                page: table.page + 1,
                pageSize: table.rowsPerPage,
                sortBy: 'startDate',
                sortOrder: 'Desc',
            });

            console.log('✅ Events chargés:', {
                count: response.items.length,
                total: response.totalItems,
            });

            setEventData(response.items);
            setEventTotalCount(response.totalItems);

        } catch (err) {
            console.error('❌ Erreur chargement events:', err);
            setEventError('Impossible de charger les événements');
            toast.error('Erreur lors du chargement des événements');
        } finally {
            setEventLoading(false);
        }
    }, [table.page, table.rowsPerPage]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📖 CHARGEMENT DES ORGANISATEURS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const loadOrganizers = useCallback(async () => {
        try {
            setOrganizerLoading(true);
            setOrganizerError(null);

            console.log('🔵 Chargement des organizers...');

            const response = await organizerService.getAll({
                page: table.page + 1,
                pageSize: table.rowsPerPage,
                // sortBy: 'firstName',
                // sortOrder: 'Asc',
            });

            console.log('✅ Organizers chargés:', response.totalItems);

            setOrganizerData(response.items);
            setOrganizerTotalCount(response.totalItems);

        } catch (err) {
            console.error('❌ Erreur chargement organizers:', err);
            setOrganizerError('Impossible de charger les organisateurs');
            toast.error('Erreur lors du chargement des organisateurs');
        } finally {
            setOrganizerLoading(false);
        }
    }, [table.page, table.rowsPerPage]);

    // Chargement selon l'onglet actif
    useEffect(() => {
        if (activeTab === 'event') {
            loadEvents();
        } else {
            loadOrganizers();
        }
    }, [activeTab, loadEvents, loadOrganizers]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 TRANSFORMATION DES DONNÉES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const formatOrganizerForTable = useCallback((organizer: Organizer): IOrganizerItem => ({
        id: organizer.id,
        name: organizerService.formatDisplayName(organizer),
        email: organizer.email,
        phoneNumber: organizer.phoneNumber,
        status: organizer.status.toLowerCase() as 'active' | 'suspended',
        _raw: organizer,
        surname: '',
        password: '',
        address: '',
        avatarUrl: '',
        isVerified: false
    }), []);

    /**
     * ✅ CORRIGÉ : Utiliser event.eventType (le label) au lieu de event.eventTypeId
     */
    // const formatEventForTable = useCallback((event: Event): IEventItem => ({
    //     id: event.id,
    //     name: event.name,
    //     matricule: event.registrationNumber,
    //     type: event.eventType, // ✅ CORRIGÉ : eventType contient le label (ex: "Salon", "Gala")
    //     date: eventService.formatEventPeriod(event),
    //     startDate: event.startDate,
    //     endDate: event.endDate,
    //     location: event.location,
    //     status: eventService.getStatusLabel(event),
    //     nomclient: event.customerName,
    //     logoClient: '',
    //     logo: event.image || '',
    //     coverUrl: event.image || '',
    //     description: event.description || '',
    // }), []);

    const formatEventForTable = useCallback(
        (event: Event): IEventItem => ({
            id: event.id,
            name: event.name,
            matricule: event.registrationNumber,
            type: event.eventType,
            date: eventService.formatEventPeriod(event),
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            status: eventService.getStatusLabel(event),
            nomclient: event.customerName,
            logoClient: '',
            logo: event.image || '',
            coverUrl: event.image || '',
            description: event.description || '',

            // ✅ VALEURS PAR DÉFAUT OBLIGATOIRES
            revenue: 0,
            photos: [],
            likes: 0,
            avis: 0,
            participants: 0,
            createdAt: new Date(),
            // Optionnel mais utile
            _raw: event,
        }),
        []
    );


    // Suite dans le prochain fichier...
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔄 CHANGEMENT D'ONGLET
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        table.onResetPage();
        filters.setState({ name: '' });
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔍 FILTRAGE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const dataFiltered = activeTab === 'event'
        ? applyEventFilter({
            eventData: eventData.map(formatEventForTable),
            filters: filters.state,
        })
        : applyOrganizerFilter({
            organizerData: organizerData.map(formatOrganizerForTable),
            filters: filters.state,
        });

    const paginatedData = dataFiltered;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🗑️ SUPPRESSION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleDeleteRow = useCallback(
        async (id: string) => {
            if (activeTab === 'event') {
                // ✅ Vérifier si l'événement peut être supprimé (pas InProgress)
                const event = eventData.find(e => e.id === id);
                if (event && event.status === 'InProgress') {
                    toast.error('Impossible de supprimer un événement en cours');
                    return;
                }

                console.log('🗑️ Suppression event:', id);

                const result = await deleteEvent(id);

                if (result && 'error' in result) {
                    toast.error(result.error || 'Erreur lors de la suppression');
                    return;
                }

                toast.success('Événement supprimé');
                loadEvents();
            } else {
                console.log('🗑️ Suppression organizer:', id);

                const result = await deleteOrganizer(id);

                if (result && 'error' in result) {
                    toast.error(result.error || 'Erreur lors de la suppression');
                    return;
                }

                toast.success('Organisateur supprimé');
                loadOrganizers();
            }
        },
        [activeTab, eventData, loadEvents, loadOrganizers]
    );

    const handleDeleteRows = useCallback(
        async () => {
            if (activeTab === 'event') {
                // ✅ Vérifier que tous les événements peuvent être supprimés
                const eventsToDelete = eventData.filter(e => table.selected.includes(e.id));
                const cannotDelete = eventsToDelete.filter(e => e.status === 'InProgress');

                if (cannotDelete.length > 0) {
                    toast.error('Certains événements en cours ne peuvent pas être supprimés');
                    return;
                }

                for (const id of table.selected) {
                    await deleteEvent(id);
                }

                toast.success('Événements supprimés');
                table.onUpdatePageDeleteRows(
                    paginatedData.length,
                    dataFiltered.length
                );
                loadEvents();
            } else {
                for (const id of table.selected) {
                    await deleteOrganizer(id);
                }

                toast.success('Organisateurs supprimés');
                table.onUpdatePageDeleteRows(
                    paginatedData.length,
                    dataFiltered.length
                );
                loadOrganizers();
            }
        },
        [activeTab, table, paginatedData.length, dataFiltered.length, eventData, loadEvents, loadOrganizers]
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔄 CHANGEMENT DE STATUT (ORGANISATEURS UNIQUEMENT)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ⚠️ IMPORTANT : Le changement de statut des événements se fait ailleurs
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleToggleOrganizerStatus = useCallback(
        async (id: string, currentStatus: string) => {
            console.log('🔄 Changement de statut organizer:', id, currentStatus);

            const result = currentStatus === 'active'
                ? await suspendOrganizer(id)
                : await unsuspendOrganizer(id);

            if (result && 'error' in result) {
                toast.error(result.error || 'Erreur lors du changement de statut');
                return;
            }

            toast.success(
                currentStatus === 'active'
                    ? 'Organisateur suspendu'
                    : 'Organisateur réactivé'
            );

            loadOrganizers();
        },
        [loadOrganizers]
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📊 CALCULS POUR L'AFFICHAGE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const canReset = !!filters.state.name;
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    const denseHeight = table.dense ? 56 : 76;

    const totalCount = activeTab === 'event'
        ? eventTotalCount
        : organizerTotalCount;

    const pageTitle = activeTab === 'event'
        ? 'Liste des événements'
        : 'Liste des organisateurs';

    const isLoading = activeTab === 'event' ? eventLoading : organizerLoading;
    const hasError = activeTab === 'event' ? eventError : organizerError;

    // Suite dans la partie 3 (rendu)...
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading={pageTitle}
                    links={[
                        { name: 'Planifier évènement' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={
                                activeTab === 'event'
                                    ? paths.admin.PLANIFIER_UN_EVENEMENT.newevent
                                    : paths.admin.PLANIFIER_UN_EVENEMENT.neworganisateur
                            }
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            {activeTab === 'event' ? 'Nouvel évènement' : 'Nouvel organisateur'}
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    {/* ONGLETS */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            px: 2.5,
                            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                        }}
                    >
                        {PLAN_EVENT_TABS.map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} />
                        ))}
                    </Tabs>

                    {/* TOOLBAR AVEC COMPTEUR */}
                    {activeTab === 'event' ? (
                        <>
                            <EventTableToolbar
                                filters={filters}
                                options={{ roles: [] }}
                                onResetPage={table.onResetPage}
                            />
                            {!isLoading && !hasError && (
                                <Box sx={{ px: 2.5, pb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {eventTotalCount} événement{eventTotalCount > 1 ? 's' : ''} au total
                                        {filters.state.name && ` (${dataFiltered.length} résultat${dataFiltered.length > 1 ? 's' : ''})`}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            <OrganizerTableToolbar
                                filters={filters}
                            />
                            {!isLoading && !hasError && (
                                <Box sx={{ px: 2.5, pb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {organizerTotalCount} organisateur{organizerTotalCount > 1 ? 's' : ''} au total
                                        {filters.state.name && ` (${dataFiltered.length} résultat${dataFiltered.length > 1 ? 's' : ''})`}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}

                    {/* RÉSULTATS DE FILTRES */}
                    {canReset && (
                        <EventTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    {/* LOADING STATE */}
                    {isLoading && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>
                                Chargement des {activeTab === 'event' ? 'événements' : 'organisateurs'}...
                            </Typography>
                        </Box>
                    )}

                    {/* ERROR STATE */}
                    {hasError && (
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
                            <Iconify icon="solar:danger-circle-bold" width={64} color="error.main" />
                            <Typography variant="h6" color="error">{hasError}</Typography>
                            <Button
                                variant="contained"
                                onClick={activeTab === 'event' ? loadEvents : loadOrganizers}
                            >
                                Réessayer
                            </Button>
                        </Box>
                    )}

                    {/* TABLEAU */}
                    {!isLoading && !hasError && (
                        <>
                            <Box sx={{ position: 'relative' }}>
                                <TableSelectedAction
                                    dense={table.dense}
                                    numSelected={table.selected.length}
                                    rowCount={dataFiltered.length}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            paginatedData.map((row) => row.id)
                                        )
                                    }
                                    action={
                                        <Tooltip title="Supprimer">
                                            <IconButton color="primary" onClick={confirm.onTrue}>
                                                <Iconify icon="solar:trash-bin-trash-bold" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                />

                                <Scrollbar sx={{ minHeight: 444 }}>
                                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                        <TableHeadCustom
                                            order={table.order}
                                            orderBy={table.orderBy}
                                            headCells={activeTab === 'event' ? EVENT_TABLE_HEAD : ORGANIZER_TABLE_HEAD}
                                            rowCount={dataFiltered.length}
                                            numSelected={table.selected.length}
                                            onSort={table.onSort}
                                            onSelectAllRows={(checked) =>
                                                table.onSelectAllRows(
                                                    checked,
                                                    paginatedData.map((row) => row.id)
                                                )
                                            }
                                        />

                                        <TableBody>
                                            {paginatedData.map((row) =>
                                                activeTab === 'event' ? (
                                                    <EventTableRow
                                                        key={row.id}
                                                        row={row as IEventItem}
                                                        selected={table.selected.includes(row.id)}
                                                        onSelectRow={() => table.onSelectRow(row.id)}
                                                        onDeleteRow={() => handleDeleteRow(row.id)}
                                                        // ❌ RETIRÉ : onToggleStatus (se fait ailleurs)
                                                        editHref={paths.admin.PLANIFIER_UN_EVENEMENT.edit(row.id)}
                                                        detailEventHref={`/admin/planifierevent/detailevenement/${row.id}`}
                                                        ficheClientHref="#"
                                                    />
                                                ) : (
                                                    <OrganizerTableRow
                                                        key={row.id}
                                                        row={row as IOrganizerItem}
                                                        selected={table.selected.includes(row.id)}
                                                        onSelectRow={() => table.onSelectRow(row.id)}
                                                        onDeleteRow={() => handleDeleteRow(row.id)}
                                                        onToggleStatus={() => handleToggleOrganizerStatus(row.id, (row as IOrganizerItem).status)}
                                                        onSuccess={loadOrganizers}
                                                    />
                                                )
                                            )}

                                            <TableEmptyRows
                                                height={denseHeight}
                                                emptyRows={emptyRows(table.page, table.rowsPerPage, totalCount)}
                                            />

                                            <TableNoData notFound={notFound} />
                                        </TableBody>
                                    </Table>
                                </Scrollbar>
                            </Box>

                            {/* PAGINATION */}
                            <TablePaginationCustom
                                page={table.page}
                                dense={table.dense}
                                count={totalCount}
                                rowsPerPage={table.rowsPerPage}
                                onPageChange={table.onChangePage}
                                onChangeDense={table.onChangeDense}
                                onRowsPerPageChange={table.onChangeRowsPerPage}
                            />
                        </>
                    )}
                </Card>
            </DashboardContent>

            {/* CONFIRMATION DE SUPPRESSION */}
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Supprimer"
                content={
                    <>
                        Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> élément(s) ?
                        {activeTab === 'event' && (
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'error.main' }}>
                                Note: Les événements en cours ne peuvent pas être supprimés.
                            </Typography>
                        )}
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Supprimer
                    </Button>
                }
            />
        </>
    );
}