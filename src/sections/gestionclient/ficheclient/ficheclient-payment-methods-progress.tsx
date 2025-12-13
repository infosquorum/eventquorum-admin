import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { Scrollbar } from 'src/components/scrollbar';

type PaymentMethod = {
  name: string;
  amount: string;
  percentage: number;
  color: string;
  icon?: string;
};

type PaymentMethodsProgressProps = {
  title?: string;
  data: PaymentMethod[];
  sx?: SxProps<Theme>;
};

const FicheClientPaymentMethodsProgress = ({
  title = "Montant reçu par moyen de paiement",
  data,
  sx
}: PaymentMethodsProgressProps) => {
  return (
    <Scrollbar sx={[{ height: 300 }]}>
      <Card sx={{ maxWidth: 800, width: '100%', ...sx }}>
        <CardContent>
          {title && (
            <Typography variant="h6" sx={{ mb: 3 }}>
              {title}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {data.map((method) => (
              <Box key={method.name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {method.icon && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={method.icon}
                          alt={`${method.name} icon`}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    )}
                    <Typography sx={{ fontWeight: 500 }}>
                      {method.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {method.amount}
                    </Typography>
                    <Typography color="text.secondary">
                      ({method.percentage}%)
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    height: 8,
                    width: '100%',
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${method.percentage}%`,
                      bgcolor: method.color,
                      position: 'absolute',
                      borderRadius: 1,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Scrollbar>
  );
};

export default FicheClientPaymentMethodsProgress;
