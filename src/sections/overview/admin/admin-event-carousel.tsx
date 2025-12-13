import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import Autoplay from 'embla-carousel-autoplay';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Image } from 'src/components/image';
import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------
// Définition du type EventStatus
type EventStatus = 'upcoming' | 'ongoing' | 'past';

// Définition du type Event
type Event = {
    id: string;
    title: string;
    imageUrl: string;
    date: Date;
    location: string;
    status: EventStatus;
};

// ----------------------------------------------------------------------
type Props = CardProps & {
    list: Event[];
};

export function EventsCarousel({ list, sx, ...other }: Props) {
    const carousel = useCarousel(
        { loop: true },
        [Autoplay({ playOnInit: true, delay: 8000 })]
    );

    return (
        <Card sx={[{ bgcolor: 'common.black' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
            <CarouselDotButtons
                scrollSnaps={carousel.dots.scrollSnaps}
                selectedIndex={carousel.dots.selectedIndex}
                onClickDot={carousel.dots.onClickDot}
                sx={{
                    right: 20,
                    bottom: 20,
                    position: 'absolute',
                    color: 'primary.light',
                }}
            />
            <Carousel carousel={carousel}>
                {list.map((item) => (
                    <CarouselItem key={item.id} item={item} />
                ))}
            </Carousel>
        </Card>
    );
}

// ----------------------------------------------------------------------
type CarouselItemProps = BoxProps & {
    item: Props['list'][number];
};

function CarouselItem({ item, ...other }: CarouselItemProps) {
    const getStatusColor = (status: EventStatus) => {
        switch (status) {
            case 'upcoming':
                return 'info.main';
            case 'ongoing':
                return 'success.main';
            default:
                return 'text.secondary';
        }
    };

    const getStatusLabel = (status: EventStatus) => {
        switch (status) {
            case 'upcoming':
                return 'À venir';
            case 'ongoing':
                return 'En cours';
            default:
                return 'Terminé';
        }
    };


    return (
        <Box sx={{ width: 1, position: 'relative', ...other }}>
            <Box
                sx={{
                    p: 3,
                    left: 0,
                    width: 1,
                    bottom: 0,
                    zIndex: 9,
                    display: 'flex',
                    position: 'absolute',
                    color: 'common.white',
                    flexDirection: 'column',
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        color: getStatusColor(item.status),
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                    }}
                >
                    {getStatusLabel(item.status)}
                </Typography>

                <Link color="inherit" underline="none" variant="h5" noWrap sx={{ mt: 1, mb: 1 }}>
                    {item.title}
                </Link>

                <Typography variant="body2" noWrap sx={{ opacity: 0.72, mb: 2 }}>
                    {fDate(item.date)} • {item.location}
                </Typography>

                <Button
                    color="primary"
                    variant="contained"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    {/* {item.status === 'past' ? 'Voir les photos' : 'Participer'} */}
                    Consulter
                </Button>
            </Box>

            <Image
                alt={item.title}
                src={item.imageUrl}
                slotProps={{
                    overlay: {
                        sx: (theme) => ({
                            backgroundImage: `linear-gradient(to bottom, transparent 0%, ${theme.vars.palette.common.black} 75%)`,
                        }),
                    },
                }}
                sx={{ width: 1, height: { xs: 288, xl: 320 } }}
            />
        </Box>
    );
}

// Exemple de données
export const _eventsList: Event[] = [
    {
        id: '1',
        title: 'Concert de Jazz au Parc',
        imageUrl: '/assets/images/events/concert.jpg',
        date: new Date('2024-01-15'),
        location: 'Parc Central',
        status: 'upcoming',
    },
    {
        id: '2',
        title: 'Festival des Arts',
        imageUrl: '/assets/images/events/festival.jpg',
        date: new Date('2024-12-20'),
        location: 'Centre Culturel',
        status: 'upcoming',
    },
    {
        id: '3',
        title: 'Exposition Photos',
        imageUrl: '/assets/images/events/expo.jpg',
        date: new Date('2024-12-10'),
        location: 'Galerie Moderne',
        status: 'upcoming',
    },
    {
        id: '4',
        title: 'Forum de l\'Innovation Technologique',
        imageUrl: '/assets/images/events/forum.jpg',
        date: new Date('2024-12-20'),
        location: 'Centre des Congrès',
        status: 'upcoming',
    },
    {
        id: '5',
        title: 'Conférence sur l\'Intelligence Artificielle',
        imageUrl: '/assets/images/events/conference.jpg',
        date: new Date('2024-12-10'),
        location: 'Université Centrale',
        status: 'upcoming',
    },
];