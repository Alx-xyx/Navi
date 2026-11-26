const STORAGE_KEY='theme';

export const TEMAS=[
    {
        id: 'aero', name: 'Aero Clasico'
    },
    {
        id: 'aeroZen', name: 'Aero Zen'
    },
    {
        id: 'dorfic', name: 'DORFic'
    },
    {
        id: 'technoZen', name: 'Techno Zen'
    },
    {
        id: 'darkAero', name: 'Dark Aero'
    },
];

export function aplicarTema(id) {
    document.documentElement.dataset.theme=id;
    try {
        localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
    };
};

export function cargarTema() {
    let id='aero';
    try {
        id=localStorage.getItem(STORAGE_KEY) || 'aero';
    } catch { };

    if (!TEMAS.some(tema => tema.id===id)) id='aero';
    document.documentElement.dataset.theme=id;
    return id;
};