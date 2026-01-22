// src/data/detailData.ts
import { MaterialIcons } from '@expo/vector-icons';

export interface DetailRow {
  label: string;
  subLabel?: string;
  price: string;
}

export interface Category {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items?: DetailRow[];
  subCategories?: Category[]; // Para acordeones anidados
  isOpen?: boolean; // Estado inicial
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    title: 'Estudios y Proyectos',
    icon: 'architecture',
    items: [
      { label: 'Diseño Básico', price: '1.200 BOB' }
    ]
  },
  {
    id: '2',
    title: 'Mensuras',
    icon: 'straighten',
    items: [] 
  },
  {
    id: '3',
    title: 'Estructuras',
    icon: 'foundation',
    isOpen: true, // Según el HTML este aparece abierto
    subCategories: [
      {
        id: '3-1',
        title: 'Estructuras Básicas',
        icon: 'folder-open',
        isOpen: true,
        items: [
          { label: 'Cálculo Estructural', subLabel: 'Vivienda Unifamiliar', price: '3.200 BOB' },
          { label: 'Revisión de Planos', subLabel: 'Certificación Básica', price: '850 BOB' }
        ]
      },
      {
        id: '3-2',
        title: 'Estructuras Medias',
        icon: 'folder-open',
        items: [
          { label: 'Cálculo Estructural', subLabel: 'Edificios hasta 5 plantas', price: '5.800 BOB' },
          { label: 'Revisión de Planos', subLabel: 'Cálculo de Cargas Especiales', price: '1.650 BOB' }
        ]
      }
    ]
  },
  { id: '4', title: 'Geotecnia', icon: 'landslide', items: [] },
  { id: '5', title: 'Hidráulica', icon: 'water-drop', items: [] },
  { id: '6', title: 'Sanitaria y Pluvial', icon: 'plumbing', items: [] },
  { id: '7', title: 'Vías y Caminos', icon: 'alt-route', items: [] },
  { id: '8', title: 'Laboratorios', icon: 'science', items: [] },
  { id: '9', title: 'Docencia', icon: 'school', items: [] },
];