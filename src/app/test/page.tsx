// src/app/test/page.tsx

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';

import { toast } from 'src/components/snackbar';

import { mediaService } from 'src/lib/medias/service';
import { updateEventCustomization } from 'src/lib/eventCustomization';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Page de test pour créer la CUSTOMISATION d'un événement
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ⚠️ IMPORTANT : Le backend ne permet de créer la customisation QU'UNE SEULE FOIS
 * Une fois créée, elle ne peut plus être modifiée !
 * 
 * ✅ TOUS LES CHAMPS SONT OPTIONNELS
 * Tu peux créer avec juste quelques champs ou tous les champs, c'est flexible !
 */
export default function TestCustomizationPage() {
    const EVENT_ID = '019b1321-67c6-773a-aee1-f255ffa27429';

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTATS POUR LES CHAMPS TEXTE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [description, setDescription] = useState('Description courte de l\'événement');
    const [longDescription, setLongDescription] = useState('Description longue et détaillée de l\'événement avec toutes les informations importantes.');
    const [partnerDescription, setPartnerDescription] = useState('Partenaire Principal - Sponsor Gold');

    // Tailles
    const [loginLogoSize, setLoginLogoSize] = useState('120');
    const [navbarLogoSize, setNavbarLogoSize] = useState('80');
    const [pdfLogoSize, setPdfLogoSize] = useState('100');
    const [partnerLogoSize, setPartnerLogoSize] = useState('150');

    // Couleurs
    const [navbarColor, setNavbarColor] = useState('#1976D2');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [uiStyle, setUiStyle] = useState('modern');
    const [backgroundColorNavbar, setBackgroundColorNavbar] = useState('#0D47A1');
    const [buttonColor, setButtonColor] = useState('#00A76F');
    const [iconColor, setIconColor] = useState('#FFD700');
    const [primaryColorLandingPage, setPrimaryColorLandingPage] = useState('#2196F3');
    const [secondaryColorLandingPage, setSecondaryColorLandingPage] = useState('#FF5722');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📦 ÉTATS POUR LES UUIDs DES MÉDIAS (OPTIONNELS)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [eventLogoId, setEventLogoId] = useState('');
    const [partnerLogoId, setPartnerLogoId] = useState('');
    const [sponsor1LogoId, setSponsor1LogoId] = useState('');
    const [sponsor2LogoId, setSponsor2LogoId] = useState('');
    const [loginImage1Id, setLoginImage1Id] = useState('');
    const [loginImage2Id, setLoginImage2Id] = useState('');
    const [squareImageId, setSquareImageId] = useState('');
    const [rectangleImageId, setRectangleImageId] = useState('');
    const [videoId, setVideoId] = useState('');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📤 FONCTION GÉNÉRIQUE POUR UPLOADER UN MÉDIA
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleUploadMedia = async (
        file: File,
        setMediaId: (id: string) => void,
        label: string
    ) => {
        try {
            setLoading(true);
            const result = await mediaService.uploadImage({
                file,
                folder: 'Events',
                onProgress: setUploadProgress,
            });
            setMediaId(result.mediaId);
            toast.success(`${label} uploadé : ${result.mediaId}`);
            console.log(`✅ ${label}:`, result.mediaId);
        } catch (error) {
            console.error(`❌ Erreur upload ${label}:`, error);
            toast.error(`Erreur upload ${label}`);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎯 CRÉER LA CUSTOMISATION (AVEC CHAMPS OPTIONNELS)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleCreateCustomization = async () => {
        try {
            setLoading(true);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Construire les sponsor logos (si au moins un existe)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const sponsorLogos = [sponsor1LogoId, sponsor2LogoId]
                .filter(id => id.trim() !== '')
                .map(id => id.trim());

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Construire les login images (si au moins une existe)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const loginImages = [loginImage1Id, loginImage2Id]
                .filter(id => id.trim() !== '')
                .map(id => id.trim());

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // Construire les partners (si logo existe)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            const partners = partnerLogoId.trim() && partnerDescription.trim()
                ? [{
                    logo: partnerLogoId.trim(),
                    description: partnerDescription.trim(),
                }]
                : null;

            const payload = {
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // 1️⃣ LANDING PAGE
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                landingPage: {
                    description: description.trim() || null,
                    longDescription: longDescription.trim() || null,
                    partners,
                },

                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // 2️⃣ CHARTE GRAPHIQUE
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                graphicsChart: {
                    // Logos et images
                    eventLogo: eventLogoId.trim() || null,
                    sponsorLogos: sponsorLogos.length > 0 ? sponsorLogos : null,
                    loginPageImages: loginImages.length > 0 ? loginImages : null,

                    // Tailles des logos (convertir en number si rempli)
                    loginLogoSize: loginLogoSize.trim() ? parseInt(loginLogoSize, 10) : null,
                    navbarLogoSize: navbarLogoSize.trim() ? parseInt(navbarLogoSize, 10) : null,
                    pdfLogoSize: pdfLogoSize.trim() ? parseInt(pdfLogoSize, 10) : null,
                    partnerLogoSize: partnerLogoSize.trim() ? parseInt(partnerLogoSize, 10) : null,

                    // Couleurs
                    navbarColor: navbarColor.trim() || null,
                    textColor: textColor.trim() || null,
                    uiStyle: uiStyle.trim() || null,
                    backgroundColorNavbar: backgroundColorNavbar.trim() || null,
                    buttonColor: buttonColor.trim() || null,
                    iconColor: iconColor.trim() || null,
                    primaryColorLandingPage: primaryColorLandingPage.trim() || null,
                    secondaryColorLandingPage: secondaryColorLandingPage.trim() || null,
                },

                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // 3️⃣ RESSOURCES
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ressources: {
                    eventVideo: videoId.trim() || null,
                    squareBackgroundImage: squareImageId.trim() || null,
                    rectangleBackgroundImage: rectangleImageId.trim() || null,
                },
            };

            console.log('🚀 Création customisation pour Event:', EVENT_ID);
            console.log('📦 Payload:', JSON.stringify(payload, null, 2));

            const result = await updateEventCustomization(EVENT_ID, payload);

            if (result.success) {
                toast.success('✅ Customisation créée avec succès !');
                console.log('✅ Résultat:', result.data);
            } else {
                toast.error(`❌ ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Erreur:', error);
            toast.error('Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
                🎨 Créer la Customisation (Tout Optionnel)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Event ID: <strong>{EVENT_ID}</strong>
            </Typography>

            <Stack spacing={3}>
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {/* SECTION 1 : LANDING PAGE */}
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Card>
                    <CardHeader
                        title="📄 Landing Page"
                        subheader="Description et partenaires (optionnel)"
                    />
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Description courte"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description courte de l'événement"
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description longue"
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                placeholder="Description détaillée..."
                            />

                            <Divider />

                            <Typography variant="subtitle2">Partenaire (optionnel)</Typography>

                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Logo du partenaire
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setPartnerLogoId, 'Partner Logo');
                                    }}
                                    disabled={loading}
                                />
                                {partnerLogoId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ UUID: {partnerLogoId}
                                    </Typography>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                label="Description du partenaire"
                                value={partnerDescription}
                                onChange={(e) => setPartnerDescription(e.target.value)}
                                placeholder="Ex: Sponsor Gold"
                                disabled={!partnerLogoId}
                            />
                        </Stack>
                    </Box>
                </Card>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {/* SECTION 2 : CHARTE GRAPHIQUE - MÉDIAS */}
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Card>
                    <CardHeader
                        title="🎨 Charte Graphique - Médias"
                        subheader="Logos et images (optionnel)"
                    />
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            {loading && uploadProgress > 0 && (
                                <Box>
                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                        Upload en cours... {uploadProgress}%
                                    </Typography>
                                </Box>
                            )}

                            {/* Event Logo */}
                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Event Logo
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setEventLogoId, 'Event Logo');
                                    }}
                                    disabled={loading}
                                />
                                {eventLogoId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {eventLogoId}
                                    </Typography>
                                )}
                            </Box>

                            <Divider />

                            {/* Sponsors */}
                            <Typography variant="subtitle2">Sponsors (optionnel)</Typography>
                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Sponsor 1
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setSponsor1LogoId, 'Sponsor 1');
                                    }}
                                    disabled={loading}
                                />
                                {sponsor1LogoId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {sponsor1LogoId}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Sponsor 2
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setSponsor2LogoId, 'Sponsor 2');
                                    }}
                                    disabled={loading}
                                />
                                {sponsor2LogoId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {sponsor2LogoId}
                                    </Typography>
                                )}
                            </Box>

                            <Divider />

                            {/* Login Images */}
                            <Typography variant="subtitle2">Images de connexion (optionnel)</Typography>
                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Image 1
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setLoginImage1Id, 'Login Image 1');
                                    }}
                                    disabled={loading}
                                />
                                {loginImage1Id && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {loginImage1Id}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Image 2
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setLoginImage2Id, 'Login Image 2');
                                    }}
                                    disabled={loading}
                                />
                                {loginImage2Id && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {loginImage2Id}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Card>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {/* SECTION 3 : CHARTE GRAPHIQUE - TAILLES ET COULEURS */}
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Card>
                    <CardHeader
                        title="📏 Charte Graphique - Tailles & Couleurs"
                        subheader="Dimensions et palette de couleurs (optionnel)"
                    />
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            {/* Tailles */}
                            <Typography variant="subtitle2">Tailles des logos (px)</Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Login"
                                    type="number"
                                    value={loginLogoSize}
                                    onChange={(e) => setLoginLogoSize(e.target.value)}
                                    sx={{ width: 120 }}
                                />
                                <TextField
                                    label="Navbar"
                                    type="number"
                                    value={navbarLogoSize}
                                    onChange={(e) => setNavbarLogoSize(e.target.value)}
                                    sx={{ width: 120 }}
                                />
                                <TextField
                                    label="PDF"
                                    type="number"
                                    value={pdfLogoSize}
                                    onChange={(e) => setPdfLogoSize(e.target.value)}
                                    sx={{ width: 120 }}
                                />
                                <TextField
                                    label="Partner"
                                    type="number"
                                    value={partnerLogoSize}
                                    onChange={(e) => setPartnerLogoSize(e.target.value)}
                                    sx={{ width: 120 }}
                                />
                            </Stack>

                            <Divider />

                            {/* Couleurs */}
                            <Typography variant="subtitle2">Couleurs</Typography>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Navbar Color"
                                        type="color"
                                        value={navbarColor}
                                        onChange={(e) => setNavbarColor(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                    <TextField
                                        label="Background Navbar"
                                        type="color"
                                        value={backgroundColorNavbar}
                                        onChange={(e) => setBackgroundColorNavbar(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                    <TextField
                                        label="Text Color"
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Button Color"
                                        type="color"
                                        value={buttonColor}
                                        onChange={(e) => setButtonColor(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                    <TextField
                                        label="Icon Color"
                                        type="color"
                                        value={iconColor}
                                        onChange={(e) => setIconColor(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Primary Landing"
                                        type="color"
                                        value={primaryColorLandingPage}
                                        onChange={(e) => setPrimaryColorLandingPage(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                    <TextField
                                        label="Secondary Landing"
                                        type="color"
                                        value={secondaryColorLandingPage}
                                        onChange={(e) => setSecondaryColorLandingPage(e.target.value)}
                                        sx={{ width: 150 }}
                                    />
                                </Stack>

                                <TextField
                                    label="UI Style"
                                    value={uiStyle}
                                    onChange={(e) => setUiStyle(e.target.value)}
                                    placeholder="Ex: modern, classic, minimal"
                                    sx={{ width: 300 }}
                                />
                            </Stack>
                        </Stack>
                    </Box>
                </Card>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {/* SECTION 4 : RESSOURCES */}
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Card>
                    <CardHeader
                        title="🎬 Ressources"
                        subheader="Vidéo et images de fond (optionnel)"
                    />
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            {/* Video */}
                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Vidéo de l'événement
                                </Typography>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setVideoId, 'Event Video');
                                    }}
                                    disabled={loading}
                                />
                                {videoId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {videoId}
                                    </Typography>
                                )}
                            </Box>

                            <Divider />

                            {/* Background Images */}
                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Image de fond carrée (1:1)
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setSquareImageId, 'Square Background');
                                    }}
                                    disabled={loading}
                                />
                                {squareImageId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {squareImageId}
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Image de fond rectangle (16:9)
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadMedia(file, setRectangleImageId, 'Rectangle Background');
                                    }}
                                    disabled={loading}
                                />
                                {rectangleImageId && (
                                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                        ✅ {rectangleImageId}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Card>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                {/* BOUTON CRÉER */}
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <Card>
                    <CardHeader
                        title="🚀 Créer la customisation"
                        subheader="⚠️ Une fois créée, elle ne peut plus être modifiée !"
                    />
                    <Box sx={{ p: 3 }}>
                        <LoadingButton
                            variant="contained"
                            size="large"
                            color="success"
                            onClick={handleCreateCustomization}
                            loading={loading}
                            fullWidth
                            sx={{ height: 56 }}
                        >
                            Créer la Customisation
                        </LoadingButton>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                            ✅ Tous les champs sont optionnels
                            <br />
                            Tu peux créer avec juste quelques champs remplis
                        </Typography>
                    </Box>
                </Card>
            </Stack>
        </Box>
    );
}