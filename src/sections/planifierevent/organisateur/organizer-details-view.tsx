'use client';

import type { OrganizerDetails } from 'src/lib/organizers/types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/admin';
// ✅ IMPORTS DU SERVICE ET ACTIONS
import { organizerService } from 'src/lib/organizers/service';
import { deleteOrganizer, suspendOrganizer, unsuspendOrganizer } from 'src/lib/organizers/actions';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
    id: string;
};

/**
 * Vue de détail d'un organisateur
 * 
 * Affiche :
 * - Informations générales (nom, email, téléphone, adresse)
 * - Statut (Actif/Suspendu)
 * - Actions (Modifier, Suspendre/Activer, Supprimer)
 * - Onglets (Informations, Événements - TODO)
 */
export function OrganizerDetailsView({ id }: Props) {
    const router = useRouter();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTAT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [organizer, setOrganizer] = useState<OrganizerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState('informations');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📖 CHARGEMENT DES DONNÉES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const loadOrganizer = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📖 Chargement des détails de l\'organisateur:', id);

            // ✅ CHARGEMENT DEPUIS L'API
            const data = await organizerService.getById(id);

            console.log('✅ Organisateur chargé:', data);

            setOrganizer(data);

        } catch (err) {
            console.error('❌ Erreur chargement:', err);
            setError('Impossible de charger l\'organisateur');
            toast.error('Erreur lors du chargement de l\'organisateur');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadOrganizer();
        }
    }, [id, loadOrganizer]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔄 ACTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleToggleStatus = useCallback(async () => {
        if (!organizer) return;

        try {
            console.log('🔄 Changement de statut:', organizer.status);

            const result = organizer.status === 'Active'
                ? await suspendOrganizer(organizer.id)
                : await unsuspendOrganizer(organizer.id);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            // Mise à jour locale
            setOrganizer(prev => prev ? {
                ...prev,
                status: prev.status === 'Active' ? 'Suspended' : 'Active'
            } : null);

            toast.success(
                organizer.status === 'Active'
                    ? 'Organisateur suspendu'
                    : 'Organisateur réactivé'
            );

        } catch (err) {
            console.error('❌ Erreur changement de statut:', err);
            toast.error('Erreur lors du changement de statut');
        }
    }, [organizer]);

    const handleDelete = useCallback(async () => {
        if (!organizer) return;

        // Confirmation
        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer ${organizerService.formatDisplayName(organizer)} ?`
        );

        if (!confirmed) return;

        try {
            console.log('🗑️ Suppression de l\'organisateur:', organizer.id);

            const result = await deleteOrganizer(organizer.id);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Organisateur supprimé avec succès');
            router.push(paths.admin.PLANIFIER_UN_EVENEMENT.root);

        } catch (err) {
            console.error('❌ Erreur suppression:', err);
            toast.error('Erreur lors de la suppression');
        }
    }, [organizer, router]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU - LOADING STATE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (loading) {
        return (
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Détails de l'organisateur"
                    links={[
                        { name: 'Planifier évènement', href: paths.admin.PLANIFIER_UN_EVENEMENT.root },
                        { name: 'Détails' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="400px"
                >
                    <CircularProgress size={60} />
                    <Typography sx={{ ml: 2 }}>Chargement des données...</Typography>
                </Box>
            </DashboardContent>
        );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU - ERROR STATE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (error || !organizer) {
        return (
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Détails de l'organisateur"
                    links={[
                        { name: 'Planifier évènement', href: paths.admin.PLANIFIER_UN_EVENEMENT.root },
                        { name: 'Détails' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                    gap={2}
                >
                    <Iconify icon="solar:danger-circle-bold" width={64} color="error.main" />
                    <Typography variant="h6" color="error">
                        {error || 'Organisateur introuvable'}
                    </Typography>
                    <Button
                        component={RouterLink}
                        href={paths.admin.PLANIFIER_UN_EVENEMENT.root}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:left-fill" />}
                    >
                        Retour à la liste
                    </Button>
                </Box>
            </DashboardContent>
        );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU - PAGE DE DÉTAIL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <DashboardContent>
            {/* BREADCRUMBS */}
            <CustomBreadcrumbs
                heading="Détails de l'organisateur"
                links={[
                    { name: 'Planifier évènement', href: paths.admin.PLANIFIER_UN_EVENEMENT.root },
                    { name: organizerService.formatDisplayName(organizer) },
                ]}
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

            {/* CARTE PRINCIPALE */}
            <Card>
                {/* EN-TÊTE AVEC AVATAR ET INFOS */}
                <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        {/* AVATAR */}
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                fontSize: '2rem',
                                bgcolor: 'primary.main',
                            }}
                        >
                            {organizerService.getInitials(organizer)}
                        </Avatar>

                        {/* INFORMATIONS */}
                        <Stack spacing={1} flexGrow={1}>
                            <Typography variant="h4">
                                {organizerService.formatDisplayName(organizer)}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Label
                                    variant="soft"
                                    color={organizer.status === 'Active' ? 'success' : 'error'}
                                >
                                    {organizerService.getStatusLabel(organizer)}
                                </Label>
                            </Stack>

                            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Iconify icon="solar:letter-bold" width={20} />
                                    <Typography variant="body2" color="text.secondary">
                                        {organizer.email}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Iconify icon="solar:phone-bold" width={20} />
                                    <Typography variant="body2" color="text.secondary">
                                        {organizer.phoneNumber}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        {/* BOUTONS D'ACTION */}
                        <Stack direction="row" spacing={1}>
                            {/* SUSPENDRE / ACTIVER */}
                            <Button
                                variant="outlined"
                                color={organizer.status === 'Active' ? 'warning' : 'success'}
                                startIcon={
                                    <Iconify
                                        icon={
                                            organizer.status === 'Active'
                                                ? 'solar:forbidden-circle-bold'
                                                : 'solar:check-circle-bold'
                                        }
                                    />
                                }
                                onClick={handleToggleStatus}
                            >
                                {organizer.status === 'Active' ? 'Suspendre' : 'Activer'}
                            </Button>

                            {/* SUPPRIMER */}
                            {/* <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                onClick={handleDelete}
                            >
                                Supprimer
                            </Button> */}
                        </Stack>
                    </Stack>
                </Box>

                <Divider />

                {/* ONGLETS */}
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    sx={{ px: 3 }}
                >
                    <Tab value="informations" label="Informations générales" />
                    <Tab value="evenements" label="Événements" disabled />
                </Tabs>

                <Divider />

                {/* CONTENU DES ONGLETS */}
                <Box sx={{ p: 3 }}>
                    {currentTab === 'informations' && (
                        <Stack spacing={3}>
                            {/* SECTION INFORMATIONS PERSONNELLES */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Informations personnelles
                                </Typography>

                                <Stack spacing={2}>
                                    {/* NOM */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Nom
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {organizer.firstName}
                                        </Typography>
                                    </Stack>

                                    {/* PRÉNOM */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Prénom
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {organizer.lastName}
                                        </Typography>
                                    </Stack>

                                    <Divider />

                                    {/* EMAIL */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Adresse email
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {organizer.email}
                                        </Typography>
                                    </Stack>

                                    {/* TÉLÉPHONE */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Numéro de téléphone
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {organizer.phoneNumber}
                                        </Typography>
                                    </Stack>

                                    {/* ADRESSE */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Adresse
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {organizer.address || 'Non renseignée'}
                                        </Typography>
                                    </Stack>

                                    <Divider />

                                    {/* STATUT */}
                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ width: 200, flexShrink: 0 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Statut
                                            </Typography>
                                        </Box>
                                        <Label
                                            variant="soft"
                                            color={organizer.status === 'Active' ? 'success' : 'error'}
                                        >
                                            {organizerService.getStatusLabel(organizer)}
                                        </Label>
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* SECTION STATISTIQUES - TODO */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Statistiques
                                </Typography>

                                <Stack direction="row" spacing={3}>
                                    <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                                        <Stack spacing={1}>
                                            <Typography variant="h3" color="primary.main">
                                                0
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Événements créés
                                            </Typography>
                                        </Stack>
                                    </Card>

                                    <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                                        <Stack spacing={1}>
                                            <Typography variant="h3" color="success.main">
                                                0
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Événements terminés
                                            </Typography>
                                        </Stack>
                                    </Card>

                                    <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                                        <Stack spacing={1}>
                                            <Typography variant="h3" color="info.main">
                                                0
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Événements en cours
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    {currentTab === 'evenements' && (
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                La liste des événements sera disponible prochainement...
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>
        </DashboardContent>
    );
}