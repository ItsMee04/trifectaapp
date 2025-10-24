// src/utilities/tooltip.js
import { Tooltip } from 'bootstrap';

export const initTooltips = () => {
    // Hapus tooltip yang sudah ada untuk menghindari duplikasi
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltipElement => {
        const existingTooltip = Tooltip.getInstance(tooltipElement);
        if (existingTooltip) {
            existingTooltip.dispose();
        }
    });

    // Inisialisasi semua tooltip baru
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
};
