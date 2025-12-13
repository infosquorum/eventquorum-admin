import React, { useState } from 'react';
import { Box, Typography, Paper, Avatar, IconButton, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Button, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import { fDate, fTime } from 'src/utils/format-time';
import { ITourItem } from 'src/types/tour';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import { Image } from 'src/components/image';
import { _mock } from 'src/_mock';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { Scrollbar } from 'src/components/scrollbar';
import { Field } from 'src/components/hook-form/fields';
import { TableNoData } from 'src/components/table';
import { FicheClientSolde } from 'src/sections/gestionclient/ficheclient/ficheclient-solde-widget';
import { PAYMENT_DATA, PaymentMethodsList } from 'src/sections/overview/admin/admin-sales-overview';

// Agenda Tab Component
type StatusType = 'terminé' | 'en cours' | 'non demarré';
type ColorType = 'success' | 'warning' | 'error' | 'default';

interface AgendaItem {
    id: number;
    date: Date;
    startTime: string;
    endTime: string;
    title: string;
    speaker: string;
    status: StatusType;
}

interface GroupedAgendaItems {
    [key: string]: AgendaItem[];
}

interface StatusColorMap {
    [key: string]: ColorType;
}

const AgendaTab: React.FC = () => {
    const agendaItems: AgendaItem[] = [
        {
            id: 1,
            date: new Date('2024-01-21'),
            startTime: '09:00',
            endTime: '09:30',
            title: 'Accueil des participants',
            speaker: 'Marie Laurent',
            status: 'terminé'
        },
        {
            id: 2,
            date: new Date('2024-01-21'),
            startTime: '09:30',
            endTime: '10:30',
            title: 'Présentation d\'ouverture',
            speaker: 'Jean Dupont',
            status: 'en cours'
        },
        {
            id: 3,
            date: new Date('2024-01-21'),
            startTime: '10:30',
            endTime: '10:45',
            title: 'Pause café',
            speaker: '',
            status: 'non demarré'
        },
        {
            id: 4,
            date: new Date('2024-01-22'),
            startTime: '09:00',
            endTime: '10:30',
            title: 'Workshop Design Thinking',
            speaker: 'Sophie Martin',
            status: 'non demarré'
        }
    ];

    // Grouper les items par date
    const groupedItems: GroupedAgendaItems = agendaItems.reduce((groups, item) => {
        const date = fDate(item.date);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {} as GroupedAgendaItems);

    const getStatusColor = (status: StatusType): ColorType => {
        const statusMap: StatusColorMap = {
            'terminé': 'success',
            'en cours': 'warning',
            'non demarré': 'error'
        };
        return statusMap[status] || 'default';
    };

    const getDuration = (startTime: string, endTime: string): string => {
        const start = new Date(`2000/01/01 ${startTime}`);
        const end = new Date(`2000/01/01 ${endTime}`);
        const diff = end.getTime() - start.getTime();
        const minutes = diff / 1000 / 60;

        if (minutes === 60) return '1h';
        if (minutes > 60) return `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? ` ${minutes % 60}min` : ''}`;
        return `${minutes}min`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={4}>
                {Object.entries(groupedItems).map(([date, items]) => (
                    <Box key={date}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                            {date}
                        </Typography>
                        <Stack spacing={2}>
                            {items.map((item: AgendaItem) => (
                                <Paper
                                    key={item.id}
                                    sx={{
                                        p: 3,
                                        backgroundColor: 'background.neutral',
                                        borderLeft: (theme) => `6px solid ${item.status === 'terminé' ? theme.palette.success.main :
                                            item.status === 'en cours' ? theme.palette.warning.main :
                                                theme.palette.error.main
                                            }`
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="subtitle1">
                                                    {item.startTime}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    →
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    {item.endTime}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                                Durée: {getDuration(item.startTime, item.endTime)}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 8 }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                {item.title}
                                            </Typography>
                                            {item.speaker && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Intervenant: {item.speaker}
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <Label
                                                variant="soft"
                                                color={getStatusColor(item.status)}
                                            >
                                                {item.status}
                                            </Label>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};


// AccessList tab component
const AccessListTab = () => {
    const [filterRole, setFilterRole] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selected, setSelected] = useState<string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openExport, setOpenExport] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const roleStats = [
        { role: "Organisateurs", count: 5 },
        { role: "Operateurs", count: 1 },
        { role: "Guichetiers", count: 1 },
        { role: "Intervenants", count: 3 },
    ]

    const accessList = [
        {
            id: "1",
            name: "Bouadou kouacou",
            email: "eavriet@gmail.com",
            phone: "0203054646",
            role: "Organisateur",
            accessCode: "**********",
        },
        {
            id: "2",
            name: "Koffi jean",
            email: "koffi@gmail.com",
            phone: "0703669646",
            role: "Operateur",
            accessCode: "**********",
        },
        {
            id: "3",
            name: "Bile maurice",
            email: "ble@gmail.com",
            phone: "0703669646",
            role: "Intervenant",
            accessCode: "**********",
        },
        {
            id: "4",
            name: "Hugues gumber",
            email: "hgum@gmail.com",
            phone: "0703669646",
            role: "Guichetier",
            accessCode: "**********",
        },
    ]

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = accessList.map((n) => n.id)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (id: string) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    const handleOpenExport = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        setOpenExport(true)
    }

    const handleCloseExport = () => {
        setOpenExport(false)
        setAnchorEl(null)
    }

    const filteredList = accessList.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = filterRole === "all" || item.role === filterRole
        return matchesSearch && matchesRole
    })

    const notFound = !(filteredList.length > 0);

    return (
        <Card>
            <Box sx={{ p: 3 }}>
                {/* Role Statistics */}
                <Stack
                    direction={{ xs: "column", sm: "row" }} // Colonne pour les petits écrans, ligne pour les grands
                    spacing={2}
                    mb={4}
                >
                    {roleStats.map((item) => (
                        <Card
                            key={item.role}
                            sx={{
                                px: { xs: 2, sm: 3 }, // Padding réduit pour petits écrans
                                py: { xs: 2, sm: 3 },
                                bgcolor: "#76d6f7",
                                color: "#182b31",
                                textAlign: { xs: "center", sm: "left" }, // Alignement central sur petits écrans
                            }}
                        >
                            <Typography variant="subtitle1">
                                {item.role} :
                                <Typography component="span" sx={{ ml: 1 }}>
                                    {item.count}
                                </Typography>
                            </Typography>
                        </Card>
                    ))}
                </Stack>


                {/* Search and Filter Controls */}
                <Stack direction={{ xs: 'column', sm: 'row', md: 'row' }} spacing={2} mb={3} justifyContent="space-between">
                    <TextField
                        size="medium"
                        placeholder="Recherche......"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: 240 }}
                    />

                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ width: 200 }}>
                            <InputLabel>Filtrer</InputLabel>
                            <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} label="Filtrer">
                                <MenuItem value="all">Tous les rôles</MenuItem>
                                <MenuItem value="Organisateur">Organisateur</MenuItem>
                                <MenuItem value="Operateur">Operateur</MenuItem>
                                <MenuItem value="Guichetier">Guichetier</MenuItem>
                                <MenuItem value="Intervenant">Intervenant</MenuItem>
                            </Select>
                        </FormControl>

                        <IconButton onClick={handleOpenExport}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Table */}
                <Scrollbar>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < accessList.length}
                                            checked={accessList.length > 0 && selected.length === accessList.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell>Nom_prenom</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Numéro téléphone</TableCell>
                                    <TableCell>Rôle</TableCell>
                                    <TableCell>Code accès</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredList.map((person) => (
                                    <TableRow
                                        key={person.id}
                                        hover
                                        onClick={() => handleClick(person.id)}
                                        role="checkbox"
                                        selected={selected.indexOf(person.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={selected.indexOf(person.id) !== -1} />
                                        </TableCell>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.email}</TableCell>
                                        <TableCell>{person.phone}</TableCell>
                                        <TableCell>{person.role}</TableCell>
                                        <TableCell>{person.accessCode}</TableCell>
                                    </TableRow>
                                ))}

                                <TableNoData notFound={notFound} sx={{ height: 200 }} />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Box>

            <CustomPopover open={openExport} anchorEl={anchorEl} onClose={handleCloseExport}>
                <MenuItem onClick={handleCloseExport}>
                    <Iconify icon="solar:printer-minimalistic-bold" sx={{ mr: 2 }} />
                    Imprimer (PDF)
                </MenuItem>
                <MenuItem onClick={handleCloseExport}>
                    <Iconify icon="solar:export-bold" sx={{ mr: 2 }} />
                    Exporter (EXCEL)
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Supprimer"
                content={
                    <>
                        Êtes-vous sûr de vouloir supprimer <strong>{selected.length}</strong> éléments?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOpenConfirm(false)
                            setSelected([])
                        }}
                    >
                        Supprimer
                    </Button>
                }
            />
        </Card>
    )
}

// Photothèque Tab Component
const PhotothequeTab = () => {
    const TRAVEL_IMAGES = Array.from({ length: 16 }, (_, index) => _mock.image.travel(index));
    const images = TRAVEL_IMAGES.slice(2, 9);

    const slides = images.map((slide) => ({ src: slide })) || [];

    const {
        selected: selectedImage,
        open: openLightbox,
        onOpen: handleOpenLightbox,
        onClose: handleCloseLightbox,
    } = useLightBox(slides);

    return (
        <>
            <Typography variant='h4' sx={{ p: 2 }}>Photothèque</Typography>

            <Box
                sx={{
                    gap: 1,
                    display: 'grid',
                    mb: { xs: 3, md: 5 },
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                }}
            >
                <Image
                    alt={slides[0].src}
                    src={slides[0].src}
                    ratio="1/1"
                    onClick={() => handleOpenLightbox(slides[0].src)}
                    sx={[
                        (theme: { transitions: { create: (arg0: string) => any; }; }) => ({
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: theme.transitions.create('opacity'),
                            '&:hover': { opacity: 0.8 },
                        }),
                    ]}
                />

                <Box sx={{ gap: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {slides.slice(1, 5).map((slide) => (
                        <Image
                            key={slide.src}
                            alt={slide.src}
                            src={slide.src}
                            ratio="1/1"
                            onClick={() => handleOpenLightbox(slide.src)}
                            sx={[
                                (theme: { transitions: { create: (arg0: string) => any; }; }) => ({
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: theme.transitions.create('opacity'),
                                    '&:hover': { opacity: 0.8 },
                                }),
                            ]}
                        />
                    ))}
                </Box>
            </Box>

            <Lightbox
                index={selectedImage}
                slides={slides}
                open={openLightbox}
                close={handleCloseLightbox}
            />

            {/* <Stack spacing={1.5}>
                <Typography variant="subtitle2">Images</Typography>
                <Field.Upload
                    multiple
                    thumbnail
                    name="images"
                    maxSize={3145728}
                    onRemove={handleRemoveFile} // handleRemoveFile doesn't exist
                    onRemoveAll={handleRemoveAllFiles} // handleRemoveAllFiles doesn't exist
                    onUpload={() => console.info('ON UPLOAD')}
                />
            </Stack> */}
        </>
    );
};

const bilanFinancierTab = () => {

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <FicheClientSolde
                        title="Montant total"
                        total={15650000}
                        percent={2.6}
                        chart={{
                            categories: [
                                'Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin',
                                'Juil', 'Août', 'Sept'
                            ],
                            series: [{
                                data: [120000, 150000, 180000, 220000, 250000, 300000, 280000, 260000, 310000]
                            }],
                        }}
                        sx={{ minHeight: 480 }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <PaymentMethodsList
                        title="Les moyens de paiement"
                        data={PAYMENT_DATA}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

// Export the tab components
export const EventTabComponents = {
    AgendaTab,
    AccessListTab,
    PhotothequeTab,
    bilanFinancierTab
};