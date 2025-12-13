'use client'

import type { ITourItem } from 'src/types/tour';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import { IEventItem } from 'src/types/event';
import { DashboardContent } from 'src/layouts/admin';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
    event?: IEventItem;
};

export function PhotothequeEventDetail({ event }: Props) {

    const slides = event?.photos.map((slide) => ({ src: slide.imageUrl })) || [];

    const {
        selected: selectedImage,
        open: openLightbox,
        onOpen: handleOpenLightbox,
        onClose: handleCloseLightbox,
    } = useLightBox(slides);

    const getDurationLabel = (period: string): string => {
        const dates = period.split(" - "); // Séparer les deux dates
        if (dates.length !== 2) return "Durée invalide"; // Vérification
    
        const [start, end] = dates.map(date => {
            const [day, month, year] = date.split("/").map(Number);
            return new Date(year, month - 1, day); // Convertir en Date JS
        });
    
        // Calculer la différence en millisecondes
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir en jours
    
        // Adapter l'affichage en fonction de la durée
        if (diffDays < 7) return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semaine${diffDays > 7 ? "s" : ""}`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} mois`;
        return `${Math.ceil(diffDays / 365)} an${diffDays >= 730 ? "s" : ""}`;
    };

    const renderGallery = () => (
        <>
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
                        (theme) => ({
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
                                (theme) => ({
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
        </>
    );

    const renderHead = () => (
        <>
            <Box sx={{ mb: 3, display: 'flex' }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    {event?.name}
                </Typography>

                <IconButton>
                    <Iconify icon="solar:share-bold" />
                </IconButton>

                {/* <Checkbox
                    defaultChecked
                    color="error"
                    icon={<Iconify icon="solar:heart-outline" />}
                    checkedIcon={<Iconify icon="solar:heart-bold" />}
                    inputProps={{ id: 'favorite-checkbox', 'aria-label': 'Favorite checkbox' }}
                /> */}
            </Box>

            <Box
                sx={{
                    gap: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        typography: 'body2',
                    }}
                >
                    <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
                    <Box component="span" sx={{ typography: 'subtitle2' }}>
                        {event?.avis}
                    </Box>

                    <Link sx={{ color: 'text.secondary' }}>(117 commentaires)</Link>
                </Box>

                <Box
                    sx={{
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        typography: 'body2',
                    }}
                >
                    <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
                    {event?.location}
                </Box>

                <Box
                    sx={{
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        typography: 'subtitle2',
                    }}
                >
                    <Iconify icon="solar:documents-bold" sx={{ color: 'info.main' }} />
                    <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
                        Type :
                    </Box>

                    {event?.type}
                </Box>
            </Box>
        </>
    );

    const renderOverview = () => (
        <Box
            sx={{
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
        >
            {[
                {
                    label: 'Periode',
                    value: event?.date,
                    icon: <Iconify icon="solar:calendar-date-bold" />,
                },
                {
                    label: 'Nom client',
                    value: event?.nomclient,
                    icon: <Iconify icon="solar:user-rounded-bold" />,
                },
                {
                    label: 'Durée',
                    value: getDurationLabel(event?.date || ''),
                    icon: <Iconify icon="solar:clock-circle-bold" />,
                },
                {
                    label: 'Participants',
                    value: event?.participants,
                    icon: <Iconify icon="solar:user-hands-bold" />,
                },
            ].map((item) => (
                <Box key={item.label} sx={{ gap: 1.5, display: 'flex' }}>
                    {item.icon}
                    <ListItemText
                        primary={item.label}
                        secondary={item.value}
                        primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.primary',
                            typography: 'subtitle2',
                        }}
                    />
                </Box>
            ))}
        </Box>
    );

    const renderContent = () => (
        <>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Description
                </Typography>
                <Markdown children={event?.description} />
            </Box>
        </>
    );

    return (
        <>
            <DashboardContent>
            <CustomBreadcrumbs
                heading="Photothéque"
                action={
                    <Button
                        component={RouterLink}
                        href={paths.admin.PHOTOTHEQUE.root}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:left-fill" />}
                    >
                        Retour
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
                <Box
                    sx={{
                        // maxWidth: 720,
                        // mx: 'auto',
                        mb: 3,
                    }}
                >
                    {renderHead()}
                </Box>

                {renderGallery()}

                <Box
                    sx={{
                        maxWidth: 720,
                        mx: 'auto',
                    }}
                >
                    {/* {renderHead()} */}


                    {/* <Divider sx={{ borderStyle: 'dashed', my: 5 }} /> */}

                    {renderOverview()}

                    <Divider sx={{ borderStyle: 'dashed', mt: 5, mb: 2 }} />

                    {renderContent()}
                </Box>
            </DashboardContent>
        </>
    );
}
