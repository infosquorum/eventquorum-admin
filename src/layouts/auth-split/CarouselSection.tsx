//src/layouts/auth-split/CarouselSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type CarouselSectionProps = BoxProps;

/**
 * Composant Carrousel autonome
 * Affiche un défilement automatique d'images avec animations
 */
export function CarouselSection({ sx, ...other }: CarouselSectionProps) {
    // État pour gérer le slide actuel
    const [currentSlide, setCurrentSlide] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Données du carrousel - Images de présentation
    const carouselData = [
        {
            id: "1",
            title: "Conférence d'entreprise festive",
            imgUrl: "/event2.avif",
            description: "Organisez des conférences d'entreprise mémorables"
        },
        {
            id: "2",
            title: "Soirée de gala",
            imgUrl: "/event10.jpg",
            description: "Créez des soirées de gala mémorables"
        },
        {
            id: "3",
            title: "Concert",
            imgUrl: "/event9.jpg",
            description: "Organisez des concerts inoubliables"
        },
        {
            id: "4",
            title: "Événement networking",
            imgUrl: "/event8.jpg",
            description: "Créez des moments de networking"
        },
        {
            id: "5",
            title: "Lancement de produit",
            imgUrl: "/produit1.png",
            description: "Organisez vos lancements de produits"
        }
    ];

    /**
     * Effet pour le défilement automatique du carrousel
     * Change d'image toutes les 4 secondes
     */
    useEffect(() => {
        const startCarousel = () => {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselData.length);
            }, 4000); // Change toutes les 4 secondes
        };

        startCarousel();

        // Nettoyage de l'intervalle lors du démontage
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [carouselData.length]);

    return (
        <Box
            sx={[
                {
                    width: 1,
                    aspectRatio: '4/3',
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {/* Images du carrousel */}
            {carouselData.map((item, index) => (
                <Box
                    key={item.id}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        transition: 'all 1s ease-in-out',
                        opacity: index === currentSlide ? 1 : 0,
                        transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
                    }}
                >
                    <Box
                        component="img"
                        alt={item.title}
                        src={item.imgUrl}
                        sx={{
                            width: 1,
                            height: 1,
                            objectFit: 'cover',
                            transition: 'transform 1s',
                        }}
                    />

                    {/* Overlay avec gradient et texte */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 24,
                                left: 24,
                                color: 'white',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                {item.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.9,
                                }}
                            >
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}

            {/* Indicateurs de slides (petits points) */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                    zIndex: 10,
                }}
            >
                {carouselData.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            opacity: index === currentSlide ? 1 : 0.5,
                            transition: 'all 0.3s',
                            cursor: 'pointer',
                            ...(index === currentSlide && {
                                width: 24,
                                borderRadius: 1,
                            }),
                            '&:hover': {
                                opacity: 0.8,
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Effet de brillance lors du changement */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    transform: 'translateX(-100%) skewX(-12deg)',
                    animation: currentSlide % 2 === 0
                        ? 'shine 3s infinite'
                        : 'shine 3s infinite 1.5s',
                    pointerEvents: 'none',
                    '@keyframes shine': {
                        '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
                        '20%': { transform: 'translateX(100%) skewX(-12deg)' },
                        '100%': { transform: 'translateX(100%) skewX(-12deg)' },
                    },
                }}
            />
        </Box>
    );
}