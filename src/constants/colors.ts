export interface MedicalColor {
  name: string;
  hex: string;
  displayName: string;
  tailwindBg: string;
  tailwindText: string;
  tailwindBorder: string;
}

export const MEDICAL_COLORS: Record<string, MedicalColor> = {
  'Ceil Blue': {
    name: 'Ceil Blue',
    hex: '#A0D6E8',
    displayName: 'Ceil Blue',
    tailwindBg: 'bg-[#A0D6E8]',
    tailwindText: 'text-[#A0D6E8]',
    tailwindBorder: 'border-[#A0D6E8]',
  },
  'Navy Blue': {
    name: 'Navy Blue',
    hex: '#1E3A5F',
    displayName: 'Navy Blue',
    tailwindBg: 'bg-[#1E3A5F]',
    tailwindText: 'text-[#1E3A5F]',
    tailwindBorder: 'border-[#1E3A5F]',
  },
  'Royal Blue': {
    name: 'Royal Blue',
    hex: '#4169E1',
    displayName: 'Royal Blue',
    tailwindBg: 'bg-[#4169E1]',
    tailwindText: 'text-[#4169E1]',
    tailwindBorder: 'border-[#4169E1]',
  },
  'Turquoise': {
    name: 'Turquoise',
    hex: '#40E0D0',
    displayName: 'Turquoise',
    tailwindBg: 'bg-[#40E0D0]',
    tailwindText: 'text-[#40E0D0]',
    tailwindBorder: 'border-[#40E0D0]',
  },
  'Teal': {
    name: 'Teal',
    hex: '#008080',
    displayName: 'Teal',
    tailwindBg: 'bg-[#008080]',
    tailwindText: 'text-[#008080]',
    tailwindBorder: 'border-[#008080]',
  },
  'Surgical Green': {
    name: 'Surgical Green',
    hex: '#008B8B',
    displayName: 'Surgical Green',
    tailwindBg: 'bg-[#008B8B]',
    tailwindText: 'text-[#008B8B]',
    tailwindBorder: 'border-[#008B8B]',
  },
  'Caribbean Blue': {
    name: 'Caribbean Blue',
    hex: '#00CED1',
    displayName: 'Caribbean Blue',
    tailwindBg: 'bg-[#00CED1]',
    tailwindText: 'text-[#00CED1]',
    tailwindBorder: 'border-[#00CED1]',
  },
  'Black': {
    name: 'Black',
    hex: '#000000',
    displayName: 'Black',
    tailwindBg: 'bg-[#000000]',
    tailwindText: 'text-[#000000]',
    tailwindBorder: 'border-[#000000]',
  },
  'White': {
    name: 'White',
    hex: '#FFFFFF',
    displayName: 'White',
    tailwindBg: 'bg-[#FFFFFF]',
    tailwindText: 'text-[#FFFFFF]',
    tailwindBorder: 'border-[#FFFFFF]',
  },
  'Gray': {
    name: 'Gray',
    hex: '#808080',
    displayName: 'Gray',
    tailwindBg: 'bg-[#808080]',
    tailwindText: 'text-[#808080]',
    tailwindBorder: 'border-[#808080]',
  },
  'Charcoal': {
    name: 'Charcoal',
    hex: '#36454F',
    displayName: 'Charcoal',
    tailwindBg: 'bg-[#36454F]',
    tailwindText: 'text-[#36454F]',
    tailwindBorder: 'border-[#36454F]',
  },
};

export const COLOR_ORDER = [
  'Ceil Blue',
  'Navy Blue',
  'Royal Blue',
  'Caribbean Blue',
  'Turquoise',
  'Teal',
  'Surgical Green',
  'Black',
  'White',
  'Gray',
  'Charcoal',
];

export const getColorInfo = (colorName: string): MedicalColor | undefined => {
  return MEDICAL_COLORS[colorName];
};
