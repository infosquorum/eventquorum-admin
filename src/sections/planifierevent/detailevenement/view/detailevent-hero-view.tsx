import React from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'minimal-shared/utils';
import { fDate } from 'src/utils/format-time';
import { _socials } from 'src/_mock';
import {
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon
} from 'src/assets/icons';
import { Label } from 'src/components/label';

// Types
export type IDetailEventHero = {
  title: string;
  matricule_event: string;
  statut: string;
  event_type: string;
  coverUrl: string;
  date: string;
  location: string;
  clientName: string;
  clientAvatarUrl: string;
};

import { useState } from 'react';
import { toast } from 'src/components/snackbar';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material';



// Status color mapping
const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' } = {
    'en cours': 'warning',
    'terminé': 'success',
    'non demarré': 'error',
    'suspendu': 'info'
  };
  return statusColors[status.toLowerCase()] || 'primary';
};

export function DetailEventHero({
  title,
  matricule_event,
  statut,
  event_type,
  coverUrl,
  date,
  location,
  clientName,
  clientAvatarUrl,
  sx,
  ...other
}: BoxProps & IDetailEventHero) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={[
        {
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.64)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.64)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: { xs: 580, md: 480 },
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 3, md: 2 },
          borderRadius: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container sx={{ height: 1, position: 'relative' }}>
        {/* Status Chip and Suspend Button */}
        <Stack
          direction="column"
          spacing={19}
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={statut}
              color={getStatusColor(statut)}
              variant="filled"
              sx={{ height: 22 }}
            />
            {statut === 'suspendu' && (
              <Tooltip title="Cet événement n'est pas accessible" placement="left" arrow>
                <IconButton sx={{ color: 'warning.main' }}>
                  <Iconify icon="mdi:information" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Event Matricule */}
        {/* <Label
          variant="inverted"
          sx={{
            position: 'absolute',
            top: { xs: 80, md: 100 },
            left: 0,
            color: 'default',
            opacity: 0.72,
          }}
        >
          Matricule : {matricule_event}
        </Label> */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: { xs: 80, md: 60 },
            left: 0,
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' }
          }}
        >

          <Avatar
            alt={clientName}
            src={clientAvatarUrl}
            sx={{
              width: 56,
              height: 56,
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          />
          <Box sx={{
            display: 'grid',
            direction: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                // letterSpacing: 1.2,
                // mt: 4,
              }}
            >
              Client
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                color: 'common.white',
                fontWeight: 500
              }}
            >
              {clientName}
            </Typography>
          </Box>
        </Stack>

        {/* Main Title */}
        <Box
          sx={{
            gap: 2.5,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: { xs: 120, md: 140 },
            left: 0,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              maxWidth: 480,
              // position: 'absolute',
              // top: { xs: 120, md: 140 },
              // left: 0,
              color: 'common.white',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Event Details */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            position: 'absolute',
            bottom: { xs: 120, md: 40 },
            ml: -3,
            left: 0,
            color: 'common.white',
            alignItems: { md: 'center' },
          }}
        >
          {/* <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              width: { xs: '100%', md: 'auto' }
            }}
          >

            <Avatar
              alt={clientName}
              src={clientAvatarUrl}
              sx={{
                width: 56,
                height: 56,
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            />

            <Box sx={{
              display: 'grid',
              direction: 'column',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  // letterSpacing: 1.2,
                  // mt: 4,
                }}
              >
                Client
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'common.white',
                  fontWeight: 500
                }}
              >
                {clientName}
              </Typography>
            </Box>
          </Stack> */}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              ml: { md: 4 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Iconify
                icon="solar:calendar-mark-bold"
                color={theme.vars.palette.warning.main}
                width={24}
                sx={{ mt: 2.6 }}
              />
              <Stack direction="column" spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600
                  }}
                >
                  Période
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'common.white',
                    fontWeight: 500
                  }}
                >
                  {date}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <Iconify
                icon="solar:map-point-bold"
                color={theme.vars.palette.error.main}
                width={24}
                sx={{ mt: 2.6 }}
              />
              <Stack direction="column" spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600
                  }}
                >
                  Lieu
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'common.white',
                    fontWeight: 500
                  }}
                >
                  {location}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon="solar:documents-bold"
                color={theme.vars.palette.info.main}
                width={24}
                sx={{ mt: 2.6 }}
              />
              <Stack direction="column" spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600
                  }}
                >
                  Type
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'common.white',
                    fontWeight: 500
                  }}
                >
                  {event_type}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Social Share */}
        <SpeedDial
          direction={smUp ? 'left' : 'up'}
          ariaLabel="Share event"
          icon={<Iconify icon="solar:share-bold" />}
          FabProps={{ size: 'medium' }}
          sx={{
            position: 'absolute',
            bottom: { xs: 32, md: 40 },
            right: { xs: 16, md: 24 }
          }}
        >
          {_socials.map((social) => (
            <SpeedDialAction
              key={social.label}
              icon={
                <>
                  {social.value === 'facebook' && <FacebookIcon />}
                  {social.value === 'instagram' && <InstagramIcon />}
                  {social.value === 'linkedin' && <LinkedinIcon />}
                  {social.value === 'twitter' && <TwitterIcon />}
                </>
              }
              tooltipPlacement="top"
              FabProps={{ color: 'default' }}
              tooltipTitle={social.label}
            />
          ))}
        </SpeedDial>
      </Container>
    </Box>
  );
}