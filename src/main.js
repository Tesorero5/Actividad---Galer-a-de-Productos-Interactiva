import './style.css';
import { productos, WHATSAPP_NUMBER } from './products.js';

// Referencias al DOM
const $ = (id) => document.getElementById(id);
const grid = $('grid');
const contenedorFiltros = $('filters');
const formFiltros = $('filters-form');
const inputPrecioMin = $('price-min');
const inputPrecioMax = $('price-max');
const selectTalla = $('size');
const checkDisponibles = $('only-available');
const mensajePrecio = $('price-msg');
const contador = $('count');
const vacio = $('empty');
const visor = $('viewer');

// Estado
let categoriaActiva = 'Todos';
let precioMinimo = null; // null = sin límite
let precioMaximo = null; // null = sin límite
let tallaActiva = 'Todas';
let soloDisponibles = false;
let visibles = [];
let actual = 0;

const formatoPrecio = (n) => `$${n.toFixed(2)}`;
const textoTalla = (t) => (t === 'Única' ? 'Talla única' : `Talla ${t}`);
const categorias = ['Todos', ...new Set(productos.map((p) => p.categoria))];
const tallas = ['Todas', ...new Set(productos.map((p) => p.talla))];

// Botones de categoría (generados con map)
function renderBotones() {
  contenedorFiltros.innerHTML = categorias
    .map(
      (c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === categoriaActiva}">${c}</button>`
    )
    .join('');

  // Un addEventListener por cada botón de categoría
  contenedorFiltros.querySelectorAll('.chip').forEach((boton) => {
    boton.addEventListener('click', () => seleccionarCategoria(boton.dataset.cat));
  });
}

function seleccionarCategoria(categoria) {
  categoriaActiva = categoria;
  contenedorFiltros.querySelectorAll('.chip').forEach((boton) => {
    boton.setAttribute('aria-pressed', boton.dataset.cat === categoria);
  });
  renderProductos();
}

// Opciones del selector de talla (generadas con map)
function renderTallas() {
  selectTalla.innerHTML = tallas.map((t) => `<option value="${t}">${t}</option>`).join('');
}

// Filtros (filter)
const filtrarPorCategoria = (lista, categoria) =>
  categoria === 'Todos' ? lista : lista.filter((p) => p.categoria === categoria);

const filtrarPorPrecio = (lista, min, max) =>
  lista.filter((p) => (min === null || p.precio >= min) && (max === null || p.precio <= max));

const filtrarPorTalla = (lista, talla) =>
  talla === 'Todas' ? lista : lista.filter((p) => p.talla === talla);

const filtrarPorDisponibilidad = (lista, solo) =>
  solo ? lista.filter((p) => p.disponible) : lista;

// Mostrar productos
function renderProductos() {
  let resultado = filtrarPorCategoria(productos, categoriaActiva);
  resultado = filtrarPorPrecio(resultado, precioMinimo, precioMaximo);
  resultado = filtrarPorTalla(resultado, tallaActiva);
  resultado = filtrarPorDisponibilidad(resultado, soloDisponibles);
  visibles = resultado;

  grid.innerHTML = visibles
    .map(
      (p, i) => `
      <button type="button" class="card${p.disponible ? '' : ' no-disponible'}" data-i="${i}" aria-label="Ver ${p.nombre}${p.disponible ? '' : ' (alquilado)'}">
        ${p.disponible ? '' : '<span class="badge">Alquilado</span>'}
        <img src="${p.miniatura}" alt="${p.nombre}" loading="lazy" />
        <span class="label">
          <b>${p.nombre}</b>
          <small>${p.categoria} · ${textoTalla(p.talla)}</small>
          <span class="price">${formatoPrecio(p.precio)}</span>
        </span>
      </button>`
    )
    .join('');

  vacio.hidden = visibles.length > 0;

  // Resumen de filtros activos
  const resumen = [`${visibles.length} ${visibles.length === 1 ? 'traje' : 'trajes'}`];
  if (categoriaActiva !== 'Todos') resumen.push(categoriaActiva);
  if (tallaActiva !== 'Todas') resumen.push(textoTalla(tallaActiva));
  if (precioMinimo !== null && precioMaximo !== null) {
    resumen.push(`${formatoPrecio(precioMinimo)} a ${formatoPrecio(precioMaximo)}`);
  } else if (precioMaximo !== null) {
    resumen.push(`hasta ${formatoPrecio(precioMaximo)}`);
  } else if (precioMinimo !== null) {
    resumen.push(`desde ${formatoPrecio(precioMinimo)}`);
  }
  if (soloDisponibles) resumen.push('solo disponibles');
  contador.textContent = resumen.join(' · ');
}

function renderTodo() {
  renderBotones();
  renderTallas();
  renderProductos();
}

// Validación de precios: muestra el mensaje y devuelve los valores, o null si hay error
function leerPrecio(input) {
  const valor = input.value.trim();
  if (valor === '') return { valor: null }; // campo vacío = sin límite
  const n = Number(valor);
  if (Number.isNaN(n) || n < 0) return { error: true };
  return { valor: n };
}

function validarPrecios() {
  const min = leerPrecio(inputPrecioMin);
  const max = leerPrecio(inputPrecioMax);
  let mensaje = '';

  if (min.error || max.error) {
    mensaje = 'Escribe precios válidos (números mayores o iguales a 0).';
  } else if (min.valor !== null && max.valor !== null && min.valor > max.valor) {
    mensaje = 'El precio mínimo no puede ser mayor que el máximo.';
  }

  mensajePrecio.textContent = mensaje;
  return mensaje === '' ? { min: min.valor, max: max.valor } : null;
}

// Panel de filtros: se aplican todos juntos con el botón "Aplicar filtros"
function aplicarFiltros() {
  const precios = validarPrecios();
  if (!precios) return; // hay un error: no se cambia la lista

  precioMinimo = precios.min;
  precioMaximo = precios.max;
  tallaActiva = selectTalla.value;
  soloDisponibles = checkDisponibles.checked;
  renderProductos();
}

function limpiarFiltros() {
  formFiltros.reset(); // vacía los campos, vuelve a "Todas" y desmarca la casilla
  mensajePrecio.textContent = '';
  precioMinimo = null;
  precioMaximo = null;
  tallaActiva = 'Todas';
  soloDisponibles = false;
  renderProductos();
}

formFiltros.addEventListener('submit', (e) => {
  e.preventDefault();
  aplicarFiltros();
});
$('filters-clear').addEventListener('click', limpiarFiltros);

// Mientras escribe, avisa si el precio no es válido (no filtra hasta pulsar el botón)
inputPrecioMin.addEventListener('input', validarPrecios);
inputPrecioMax.addEventListener('input', validarPrecios);

// Visor ampliado
function mostrar(i) {
  if (visibles.length === 0) return;
  actual = (i + visibles.length) % visibles.length;
  const p = visibles[actual];
  $('viewer-img').src = p.grande;
  $('viewer-img').alt = p.nombre;
  $('viewer-name').textContent = p.nombre;
  $('viewer-cat').textContent =
    `${p.categoria} · ${textoTalla(p.talla)} · ${formatoPrecio(p.precio)}${p.disponible ? '' : ' · Alquilado'}`;
  const pregunta = p.disponible ? '¿Está disponible?' : 'Veo que está alquilado, ¿para cuándo estaría disponible?';
  const msg = encodeURIComponent(`Hola, me interesa el traje "${p.nombre}" (${formatoPrecio(p.precio)}). ${pregunta}`);
  $('viewer-wa').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  if (!visor.open) visor.showModal();
}

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) mostrar(Number(card.dataset.i));
});
$('close').addEventListener('click', () => visor.close());
$('prev').addEventListener('click', () => mostrar(actual - 1));
$('next').addEventListener('click', () => mostrar(actual + 1));
visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });
visor.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') mostrar(actual - 1);
  if (e.key === 'ArrowRight') mostrar(actual + 1);
});

// Inicio
renderTodo();