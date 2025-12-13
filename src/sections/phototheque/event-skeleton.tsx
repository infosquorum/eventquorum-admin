import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export function EventItemSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 200, borderRadius: 2 }} />
      <Stack spacing={1}>
        <Skeleton variant="text" sx={{ width: '70%' }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="text" sx={{ width: 60 }} />
          <Skeleton variant="text" sx={{ width: 60 }} />
        </Stack>
      </Stack>
    </Stack>
  );
}