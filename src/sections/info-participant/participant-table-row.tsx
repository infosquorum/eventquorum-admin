import { IParticipantItem } from 'src/types/participant';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    row: IParticipantItem;
    onViewDetails?: () => void;
    activeTab: string;
};

export function ParticipantTableRow({ 
    row,
    onViewDetails,
    activeTab
}: Props) {

    const getStatusColor = (status: string, tab: string) => {
        if (tab === 'demandes') {
            switch (status) {
                case 'acceptée':
                    return 'success';
                case 'rejetée':
                    return 'error';
                case 'en attente':
                    return 'warning';
                default:
                    return 'default';
            }
        } else if (tab === 'participants') {
            switch (status) {
                case 'en présentiel':
                    return 'info';
                case 'en ligne':
                    return 'warning';
                default:
                    return 'default';
            }
        }
        return 'default';
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'acceptée':
                return 'Acceptée';
            case 'rejetée':
                return 'Rejetée';
            case 'en attente':
                return 'En attente';
            case 'en présentiel':
                return 'En présentiel';
            case 'en ligne':
                return 'En ligne';
            default:
                return status;
        }
    };

    const getBooleanLabel = (value: boolean | string | undefined) => {
        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }
        return value === 'oui' || value === 'Oui' ? 'Oui' : 'Non';
    };

    const getBooleanColor = (value: boolean | string | undefined) => {
        if (typeof value === 'boolean') {
            return value ? 'success' : 'error';
        }
        return value === 'oui' || value === 'Oui' ? 'success' : 'error';
    };

    // NOUVEAU: Fonction pour afficher les points colorés au lieu de Oui/Non
    const renderConnectionDot = (value: boolean | string | undefined) => {
        const isConnected = typeof value === 'boolean' ? value : (value === 'oui' || value === 'Oui' || value === 'connecté');
        
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: isConnected ? '#22c55e' : '#ef4444', // vert ou rouge
                    }}
                />
            </Box>
        );
    };

    // Fonction pour gérer l'émargement (signé/non signé)
    const getEmargementLabel = (emargement: string | undefined) => {
        if (!emargement) return 'Non';
        return emargement === 'signé' ? 'Oui' : 'Non';
    };

    const getEmargementColor = (emargement: string | undefined) => {
        if (!emargement) return 'error';
        return emargement === 'signé' ? 'success' : 'error';
    };

    // Rendu conditionnel selon l'onglet actif
    const renderTableCells = () => {
        switch (activeTab) {
            case 'demandes':
                return (
                    <>
                        <TableCell>
                            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle2" noWrap>
                                    {row.nom_prenom}
                                </Typography>
                            </Stack>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                {row.email}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">
                                {row.telephone}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                {row.date}
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Label
                                variant="soft"
                                color={getStatusColor(row.statut, activeTab)}
                            >
                                {getStatusLabel(row.statut)}
                            </Label>
                        </TableCell>
                    </>
                );

            case 'invites':
                return (
                    <>
                        <TableCell>
                            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle2" noWrap>
                                    {row.nom_prenom}
                                </Typography>
                            </Stack>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                {row.email}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">
                                {row.telephone}
                            </Typography>
                        </TableCell>

                        {/* MODIFIÉ: Point coloré au lieu de Oui/Non */}
                        <TableCell sx={{ textAlign: 'center' }}>
                            {renderConnectionDot(row.connecte)}
                        </TableCell>

                        <TableCell sx={{ textAlign: 'center' }}>
                            <Label
                                variant="soft"
                                color={getBooleanColor(row.premiere_connexion)}
                            >
                                {getBooleanLabel(row.premiere_connexion)}
                            </Label>
                        </TableCell>

                        <TableCell sx={{ textAlign: 'center' }}>
                            <Label
                                variant="soft"
                                color={getBooleanColor(row.achat_effectue)}
                            >
                                {getBooleanLabel(row.achat_effectue)}
                            </Label>
                        </TableCell>

                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Tooltip title="Voir détails" placement="top" arrow>
                                    <IconButton
                                        color="info"
                                        onClick={() => onViewDetails?.()}
                                        size="small"
                                    >
                                        <Iconify icon="solar:eye-bold" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </TableCell>
                    </>
                );

            case 'participants':
                return (
                    <>
                        {/* MODIFIÉ: Une seule colonne pour nom_prenom */}
                        <TableCell>
                            <Typography variant="subtitle2" noWrap>
                                {row.nom_prenom}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">
                                {row.telephone}
                            </Typography>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                {row.email}
                            </Typography>
                        </TableCell>

                        {/* MODIFIÉ: Point coloré au lieu de Oui/Non */}
                        <TableCell sx={{ textAlign: 'center' }}>
                            {renderConnectionDot(row.connecte)}
                        </TableCell>

                        <TableCell>
                            <Label
                                variant="soft"
                                color={getStatusColor(row.statut, activeTab)}
                            >
                                {getStatusLabel(row.statut)}
                            </Label>
                        </TableCell>

                        {/* Colonne Emargement avec "Oui"/"Non" */}
                        <TableCell sx={{ textAlign: 'center' }}>
                            <Label
                                variant="soft"
                                color={getEmargementColor(row.emargement)}
                            >
                                {getEmargementLabel(row.emargement)}
                            </Label>
                        </TableCell>

                        <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Tooltip title="Voir détails" placement="top" arrow>
                                    <IconButton
                                        color="info"
                                        onClick={() => onViewDetails?.()}
                                        size="small"
                                    >
                                        <Iconify icon="solar:eye-bold" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </TableCell>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <TableRow hover tabIndex={-1}>
            {renderTableCells()}
        </TableRow>
    );
}