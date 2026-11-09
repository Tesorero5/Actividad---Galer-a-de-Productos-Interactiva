export const WHATSAPP_NUMBER = '50379035297';

const BASE = 'https://res.cloudinary.com/jgmzopn7/image/upload/';

// Arreglo de productos (nombre, precio, categoría, talla y disponibilidad)
// disponible: false = alquilado
const datos = [
  { id: 1, nombre: 'Harry Potter', precio: 25, categoria: 'Adultos', talla: 'S', disponible: true, archivo: 'v1794194035/IMG_6024.jpg' },
  { id: 2, nombre: 'Capa Slytherin', precio: 25, categoria: 'Adultos', talla: 'S', disponible: false, archivo: 'v1794194031/WhatsApp_Image_2026-10-25_at_10.02.44_AM_1.jpg' },
  { id: 3, nombre: 'Antorcha Humana', precio: 18, categoria: 'Niños', talla: '4', disponible: true, archivo: 'v1794194037/IMG_6017.jpg' },
  { id: 4, nombre: 'Thor', precio: 20, categoria: 'Niños', talla: '4', disponible: true, archivo: 'v1794194037/IMG_6014.jpg' },
  { id: 5, nombre: 'Medieval', precio: 15, categoria: 'Niños', talla: '4', disponible: false, archivo: 'v1794194038/IMG_6015.jpg' },
  { id: 6, nombre: 'Superman', precio: 15, categoria: 'Niños', talla: '4', disponible: true, archivo: 'v1794194039/IMG_6016.jpg' },
  { id: 7, nombre: 'Santa Claus', precio: 15, categoria: 'Temporada', talla: 'L', disponible: true, archivo: 'v1794194033/IMG_6218.jpg' },
  { id: 8, nombre: 'Traje Navideño', precio: 22, categoria: 'Niños', talla: '4', disponible: true, archivo: 'v1794194031/IMG_6226.jpg' },
  { id: 9, nombre: 'Gorro Duende 1', precio: 2, categoria: 'Temporada', talla: 'Única', disponible: true, archivo: 'v1794194032/IMG_6241.jpg' },
  { id: 10, nombre: 'Gorro Navideño', precio: 3, categoria: 'Temporada', talla: 'Única', disponible: true, archivo: 'v1794194031/IMG_6240.jpg' },
  { id: 11, nombre: 'Gorro Duende 2', precio: 2, categoria: 'Temporada', talla: 'Única', disponible: true, archivo: 'v1794194030/IMG_6245.jpg' },
  { id: 12, nombre: 'Gorro Duende 3', precio: 7, categoria: 'Temporada', talla: 'Única', disponible: true, archivo: 'v1794194030/IMG_6249.jpg' },
];

// Se agregan las URLs de imagen (miniatura liviana y versión grande)
export const productos = datos.map((p) => ({
  ...p,
  miniatura: `${BASE}w_600,q_auto,f_auto/${p.archivo}`,
  grande: `${BASE}w_1400,q_auto,f_auto/${p.archivo}`,
}));
