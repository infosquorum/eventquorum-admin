//src/layouts/nav-config-admin.tsx

import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
    <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
    job: icon('ic-job'),
    blog: icon('ic-blog'),
    chat: icon('ic-chat'),
    mail: icon('ic-mail'),
    user: icon('ic-user'),
    file: icon('ic-file'),
    lock: icon('ic-lock'),
    tour: icon('ic-tour'),
    order: icon('ic-order'),
    label: icon('ic-label'),
    blank: icon('ic-blank'),
    kanban: icon('ic-kanban'),
    folder: icon('ic-folder'),
    course: icon('ic-course'),
    banking: icon('ic-banking'),
    booking: icon('ic-booking'),
    invoice: icon('ic-invoice'),
    product: icon('ic-product'),
    calendar: icon('ic-calendar'),
    disabled: icon('ic-disabled'),
    external: icon('ic-external'),
    menuItem: icon('ic-menu-item'),
    ecommerce: icon('ic-ecommerce'),
    analytics: icon('ic-analytics'),
    dashboard: icon('ic-dashboard'),
    phototheque: icon('ic-phototheque'),
    parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const adminNavData: NavSectionProps['data'] = [
    /**
     * Overview
     */
    {
        // subheader: 'Aperçu',
        items: [
            { title: 'Accueil', path: paths.admin.root, icon: ICONS.dashboard },
            { title: 'Gestion client', path: paths.admin.GESTION_CLIENT.root, icon: ICONS.job },
            { title: 'Planifier un evenement', path: paths.admin.PLANIFIER_UN_EVENEMENT.root, icon: ICONS.calendar },
            { title: 'Photothèque', path: paths.admin.PHOTOTHEQUE.root, icon: ICONS.phototheque },
        ],
    },
];
