import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';
import { IEventItem } from 'src/types/event';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
import { AvatarShape } from 'src/assets/illustrations';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

type EventItemProps = CardProps & {
    event: IEventItem;
    detailsHref: string;
};

export function EventItem({ event, detailsHref, sx, ...other }: EventItemProps) {
    return (
        <>
            {/* <Card sx={sx} {...other}>
            <Box sx={{ position: 'relative' }}>
                <AvatarShape
                    sx={{
                        left: 0,
                        zIndex: 9,
                        width: 88,
                        height: 36,
                        bottom: -16,
                        position: 'absolute',
                    }}
                />

                <Tooltip title={event.nomclient}>
                    <Avatar
                        alt={event.nomclient}
                        src={event.logoClient}
                        sx={{
                            left: 24,
                            zIndex: 9,
                            bottom: -24,
                            position: 'absolute',
                        }}
                    />
                </Tooltip>

                <Image alt={event.name} src={event.coverUrl} ratio="4/3" />
            </Box>

            <CardContent sx={{ pt: 6 }}>
                <Typography variant="caption" component="div" sx={{ mb: 1, color: 'text.disabled' }}>
                    {fDate(event.createdAt)}
                </Typography>

                <Link
                    component={RouterLink}
                    href={detailsHref}
                    color="inherit"
                    variant="subtitle2"
                    sx={(theme) => ({
                        ...theme.mixins.maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
                    })}
                >
                    {event.name}
                </Link>

                <EventInfoBlock
                    participants={event.participants}
                    likes={event.likes}
                    revenue={event.revenue}
                />
            </CardContent>
        </Card> */}
            <Card>
                <Tooltip title={event.nomclient}>
                    <Avatar
                        alt={event.nomclient}
                        src={event.logoClient}
                        sx={{
                            top: 24,
                            left: 24,
                            zIndex: 9,
                            position: 'absolute',
                        }}
                    />
                </Tooltip>

                <Image
                    alt={event.name}
                    src={event.coverUrl}
                    ratio="4/3"
                    sx={{ height: 360 }}
                    slotProps={{
                        overlay: {
                            sx: (theme) => ({
                                bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
                            }),
                        },
                    }}
                />

                <CardContent
                    sx={{
                        width: 1,
                        zIndex: 9,
                        bottom: 0,
                        position: 'absolute',
                        color: 'common.white',
                    }}
                >
                    <Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
                        {fDate(event.createdAt)}
                    </Typography>

                    <Link
                        component={RouterLink}
                        href={detailsHref}
                        color="inherit"
                        variant='subtitle2'
                        sx={(theme) => ({
                            ...theme.mixins.maxLine({
                                line: 2,
                                persistent: theme.typography.subtitle2,
                            }),
                        })}
                    >
                        {event.name}
                    </Link>

                    <EventInfoBlock
                        participants={event.participants}
                        likes={event.likes}
                        revenue={event.revenue}
                        sx={{ opacity: 0.64, color: 'common.white' }}
                    />
                </CardContent>
            </Card>
        </>
    );
}

// ----------------------------------------------------------------------

type EventItemLatestProps = {
    event: IEventItem;
    index: number;
    detailsHref: string;
};

export function EventItemLatest({ event, index, detailsHref }: EventItemLatestProps) {
    const isSmall = index === 1 || index === 2;

    return (
        <Card>
            <Tooltip title={event.nomclient}>
                <Avatar
                    alt={event.nomclient}
                    src={event.logoClient}
                    sx={{
                        top: 24,
                        left: 24,
                        zIndex: 9,
                        position: 'absolute',
                    }}
                />
            </Tooltip>

            <Image
                alt={event.name}
                src={event.coverUrl}
                ratio="4/3"
                sx={{ height: 360 }}
                slotProps={{
                    overlay: {
                        sx: (theme) => ({
                            bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
                        }),
                    },
                }}
            />

            <CardContent
                sx={{
                    width: 1,
                    zIndex: 9,
                    bottom: 0,
                    position: 'absolute',
                    color: 'common.white',
                }}
            >
                <Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
                    {fDate(event.createdAt)}
                </Typography>

                <Link
                    component={RouterLink}
                    href={detailsHref}
                    color="inherit"
                    variant={isSmall ? 'subtitle2' : 'h5'}
                    sx={(theme) => ({
                        ...theme.mixins.maxLine({
                            line: 2,
                            persistent: isSmall ? theme.typography.subtitle2 : theme.typography.h5,
                        }),
                    })}
                >
                    {event.name}
                </Link>

                <EventInfoBlock
                    participants={event.participants}
                    likes={event.likes}
                    revenue={event.revenue}
                    sx={{ opacity: 0.64, color: 'common.white' }}
                />
            </CardContent>
        </Card>
    );
}

// ----------------------------------------------------------------------

type EventInfoBlockProps = BoxProps & {
    participants: number;
    likes: number;
    revenue: number;
};

function EventInfoBlock({ sx, participants, likes, revenue, ...other }: EventInfoBlockProps) {
    return (
        <Box
            sx={[
                () => ({
                    mt: 1,
                    gap: 1.5,
                    display: 'flex',
                    typography: 'caption',
                    color: 'text.disabled',
                    justifyContent: 'flex-end',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify width={16} icon="eva:person-fill" />
                {fShortenNumber(participants)}
            </Box>

            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify width={16} icon="eva:heart-fill" />
                {fShortenNumber(likes)}
            </Box>

            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify width={16} icon="bxs:wallet" />
                {fShortenNumber(revenue)}
            </Box>
        </Box>
    );
}