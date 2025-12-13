// src/lib/eventCustomization/types.ts

/**
 * Partner pour la Landing Page
 */
export interface Partner {
  logo: string;
  description: string;
}

/**
 * Section Landing Page
 */
export interface LandingPage {
  description?: string | null;
  longDescription?: string | null;
  partners?: Partner[] | null;
}

/**
 * Section Charte Graphique
 */
export interface GraphicsChart {
  eventLogo?: string | null;
  sponsorLogos?: string[] | null;
  loginPageImages?: string[] | null;
  loginLogoSize?: number | null;
  navbarLogoSize?: number | null;
  pdfLogoSize?: number | null;
  partnerLogoSize?: number | null;
  navbarColor?: string | null;
  textColor?: string | null;
  uiStyle?: string | null;
  backgroundColorNavbar?: string | null;
  buttonColor?: string | null;
  iconColor?: string | null;
  primaryColorLandingPage?: string | null;
  secondaryColorLandingPage?: string | null;
}

/**
 * Section Ressources
 */
export interface Resources {
  eventVideo?: string | null;
  squareBackgroundImage?: string | null;
  rectangleBackgroundImage?: string | null;
}

/**
 * EventCustomization : Réponse du GET
 */
export interface EventCustomization {
  eventId: string;
  landingPage?: LandingPage | null;
  graphicsChart?: GraphicsChart | null;
  ressources?: Resources | null;
}

/**
 * UpdateEventCustomizationDto : Données envoyées au POST
 */
export interface UpdateEventCustomizationDto {
  landingPage: LandingPage;
  graphicsChart: GraphicsChart;
  ressources: Resources;
}