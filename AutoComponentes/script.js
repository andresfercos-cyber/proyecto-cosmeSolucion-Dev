// Datos de ejemplo para componentes en venta
const productosVenta = [
  {
    id: 1,
    nombre: "Motor V6",
    descripcion: "Motor en perfecto estado, 3.5L, bajo kilometraje.",
    precio: "$1,200,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Motor+V6",
  },
  {
    id: 2,
    nombre: "Transmisión Automática",
    descripcion:
      "Transmisión automática de 6 velocidades, revisada y garantizada.",
    precio: "$800,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Transmisión",
  },
  {
    id: 3,
    nombre: "Suspensión Delantera",
    descripcion: "Kit de suspensión delantera completo, nuevo.",
    precio: "$450,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Suspensión",
  },
  {
    id: 4,
    nombre: "Frenos de Disco",
    descripcion: "Kit de frenos de disco para 4 ruedas, incluye pastillas.",
    precio: "$300,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Frenos",
  },
];

// Datos de ejemplo para componentes reparados
const productosReparados = [
  {
    id: 1,
    nombre: "Alternador Reparado",
    descripcion: "Alternador reparado y probado, 12V, 80A.",
    precio: "$150,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Alternador",
  },
  {
    id: 2,
    nombre: "Bomba de Agua",
    descripcion: "Bomba de agua reparada, garantía de 3 meses.",
    precio: "$100,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Bomba+de+Agua",
  },
  {
    id: 3,
    nombre: "Compresor de Aire Acondicionado",
    descripcion: "Compresor de AC reparado y sellado, listo para instalar.",
    precio: "$250,000 COP",
    imagen: "https://via.placeholder.com/300x200?text=Compresor+AC",
  },
];

// Función para cargar productos en el DOM
function cargarProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="price">${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id}, '${contenedorId}')">Agregar al Carrito</button>
        `;
    contenedor.appendChild(card);
  });
}

// Función para scroll a una sección
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Función para agregar al carrito (simulada)
function agregarAlCarrito(id, contenedorId) {
  const productos =
    contenedorId === "productos-venta" ? productosVenta : productosReparados;
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    alert(`Agregado al carrito: ${producto.nombre} - ${producto.precio}`);
  }
}

// Cargar productos al iniciar la página
window.onload = function () {
  cargarProductos(productosVenta, "productos-venta");
  cargarProductos(productosReparados, "productos-reparados");
};

// Manejar envío del formulario
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
    this.reset();
  });
