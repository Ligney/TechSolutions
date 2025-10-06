// ===== VARIABLES GLOBALES =====
let filaEditando = null

// ===== NAVEGACIÓN PRINCIPAL =====
function mostrarPagina(idPagina) {
  // Ocultar todas las páginas
  document.querySelectorAll(".pagina").forEach((pagina) => {
    pagina.style.display = "none"
    pagina.classList.remove("activa")
  })

  // Mostrar la página seleccionada
  const paginaObjetivo = document.getElementById(idPagina)
  if (paginaObjetivo) {
    const estiloDisplay = ["pagina-login", "pagina-dashboard"].includes(idPagina) ? "flex" : "block"
    paginaObjetivo.style.display = estiloDisplay
    paginaObjetivo.classList.add("activa")
  }
}

// ===== AUTENTICACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("formulario-login")
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", (e) => {
      e.preventDefault()

      const usuario = document.getElementById("usuario").value
      const contrasena = document.getElementById("contrasena").value
      const errorLogin = document.getElementById("error-login")

      if (usuario === "admin" && contrasena === "admin") {
        mostrarPagina("pagina-dashboard")
        errorLogin.style.display = "none"
        formularioLogin.reset()
      } else {
        errorLogin.style.display = "block"
        // Agregar animación de error
        errorLogin.style.animation = "shake 0.5s ease-in-out"
        setTimeout(() => {
          errorLogin.style.animation = ""
        }, 500)
      }
    })
  }

  // Cerrar sesión
  const botonCerrarSesion = document.getElementById("boton-cerrar-sesion")
  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      const formularioLogin = document.getElementById("formulario-login")
      if (formularioLogin) {
        formularioLogin.reset()
      }
      mostrarPagina("pagina-login")
    })
  }
})

// ===== NAVEGACIÓN DEL DASHBOARD =====
document.addEventListener("DOMContentLoaded", () => {
  const enlacesNavegacion = document.querySelectorAll(".enlace-navegacion")

  enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault()

      // Remover clase activa de todos los enlaces y secciones
      enlacesNavegacion.forEach((el) => el.classList.remove("activo"))
      document.querySelectorAll(".seccion-dashboard").forEach((seccion) => {
        seccion.classList.remove("activa")
      })

      // Agregar clase activa al enlace clickeado
      this.classList.add("activo")

      // Mostrar la sección correspondiente
      const objetivoSeccion = this.getAttribute("data-objetivo")
      const seccion = document.getElementById(objetivoSeccion)
      if (seccion) {
        seccion.classList.add("activa")
      }
    })
  })
})

// ===== GESTIÓN DE MODALES =====
const modal = document.getElementById("modal-crud")
const tituloModal = document.getElementById("titulo-modal")
const cuerpoModal = document.getElementById("cuerpo-modal")
const botonGuardarModal = document.getElementById("boton-guardar-modal")

function abrirModal(modo, tipo, elemento = null) {
  if (modo === "editar") {
    filaEditando = elemento.closest("tr")
  } else {
    filaEditando = null
  }

  if (tipo === "servicio") {
    configurarModalServicio(modo)
  } else if (tipo === "usuario") {
    configurarModalUsuario(modo)
  }

  // Mostrar modal con animación
  modal.style.display = "flex"
  setTimeout(() => {
    modal.classList.add("activo")
  }, 10)
}

function cerrarModal() {
  modal.classList.remove("activo")
  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
}

function configurarModalServicio(modo) {
  tituloModal.textContent = modo === "agregar" ? "Agregar Nuevo Servicio" : "Editar Servicio"

  let servicio = { id: "", nombre: "", precio: "", stock: "", estado: "Disponible" }

  if (filaEditando) {
    servicio = {
      id: filaEditando.cells[0].textContent,
      nombre: filaEditando.cells[1].textContent,
      precio: filaEditando.cells[2].textContent,
      stock: filaEditando.cells[3].textContent,
      estado: filaEditando.cells[4].textContent.trim(),
    }
  }

  cuerpoModal.innerHTML = `
        <div class="grupo-formulario">
            <label for="nombre-servicio">Nombre del Servicio:</label>
            <input type="text" id="nombre-servicio" value="${servicio.nombre}" required>
        </div>
        <div class="grupo-formulario">
            <label for="precio-servicio">Precio:</label>
            <input type="text" id="precio-servicio" value="${servicio.precio}" required>
        </div>
        <div class="grupo-formulario">
            <label for="stock-servicio">Stock:</label>
            <input type="number" id="stock-servicio" value="${servicio.stock}" min="0" required>
        </div>
        <div class="grupo-formulario">
            <label for="estado-servicio">Estado:</label>
            <select id="estado-servicio" required>
                <option value="Disponible" ${servicio.estado === "Disponible" ? "selected" : ""}>Disponible</option>
                <option value="En Promoción" ${servicio.estado === "En Promoción" ? "selected" : ""}>En Promoción</option>
                <option value="Agotado" ${servicio.estado === "Agotado" ? "selected" : ""}>Agotado</option>
            </select>
        </div>
    `

  // Aplicar estilos a los elementos del formulario
  aplicarEstilosFormulario()

  botonGuardarModal.onclick = () => guardarServicio()
}

function configurarModalUsuario(modo) {
  tituloModal.textContent = modo === "agregar" ? "Agregar Nuevo Usuario" : "Editar Usuario"

  let usuario = { id: "", nombre: "", email: "", rol: "Cliente" }

  if (filaEditando) {
    usuario = {
      id: filaEditando.cells[0].textContent,
      nombre: filaEditando.cells[1].textContent,
      email: filaEditando.cells[2].textContent,
      rol: filaEditando.cells[3].textContent.trim(),
    }
  }

  cuerpoModal.innerHTML = `
        <div class="grupo-formulario">
            <label for="nombre-usuario">Nombre Completo:</label>
            <input type="text" id="nombre-usuario" value="${usuario.nombre}" required>
        </div>
        <div class="grupo-formulario">
            <label for="email-usuario">Email:</label>
            <input type="email" id="email-usuario" value="${usuario.email}" required>
        </div>
        <div class="grupo-formulario">
            <label for="rol-usuario">Rol:</label>
            <select id="rol-usuario" required>
                <option value="Cliente" ${usuario.rol === "Cliente" ? "selected" : ""}>Cliente</option>
                <option value="Admin" ${usuario.rol === "Admin" ? "selected" : ""}>Admin</option>
                <option value="Moderador" ${usuario.rol === "Moderador" ? "selected" : ""}>Moderador</option>
            </select>
        </div>
    `

  // Aplicar estilos a los elementos del formulario
  aplicarEstilosFormulario()

  botonGuardarModal.onclick = () => guardarUsuario()
}

function aplicarEstilosFormulario() {
  const inputs = cuerpoModal.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.style.width = "100%"
    input.style.padding = "12px 16px"
    input.style.background = "rgba(255, 255, 255, 0.05)"
    input.style.border = "1px solid rgba(255, 255, 255, 0.2)"
    input.style.borderRadius = "8px"
    input.style.color = "var(--color-texto-primario)"
    input.style.fontSize = "14px"
    input.style.transition = "var(--transicion-rapida)"

    input.addEventListener("focus", function () {
      this.style.borderColor = "var(--color-primario)"
      this.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)"
    })

    input.addEventListener("blur", function () {
      this.style.borderColor = "rgba(255, 255, 255, 0.2)"
      this.style.boxShadow = "none"
    })
  })
}

// ===== FUNCIONES CRUD =====
function guardarServicio() {
  const nombre = document.getElementById("nombre-servicio").value.trim()
  const precio = document.getElementById("precio-servicio").value.trim()
  const stock = document.getElementById("stock-servicio").value.trim()
  const estado = document.getElementById("estado-servicio").value

  if (!nombre || !precio || !stock) {
    mostrarNotificacion("Por favor, completa todos los campos.", "error")
    return
  }

  if (filaEditando) {
    // Editar servicio existente
    filaEditando.cells[1].textContent = nombre
    filaEditando.cells[2].textContent = precio
    filaEditando.cells[3].textContent = stock

    const estadoSpan = filaEditando.cells[4].querySelector("span")
    estadoSpan.textContent = estado
    estadoSpan.className =
      estado === "En Promoción" ? "estado-promocion" : estado === "Agotado" ? "estado-agotado" : "estado-disponible"

    mostrarNotificacion("Servicio actualizado correctamente.", "exito")
  } else {
    // Agregar nuevo servicio
    const cuerpoTabla = document.getElementById("cuerpo-tabla-servicios")
    const nuevoId = cuerpoTabla.rows.length + 1
    const nuevaFila = cuerpoTabla.insertRow()

    const claseEstado =
      estado === "En Promoción" ? "estado-promocion" : estado === "Agotado" ? "estado-agotado" : "estado-disponible"

    nuevaFila.innerHTML = `
            <td>${nuevoId}</td>
            <td>${nombre}</td>
            <td class="precio-tabla">${precio}</td>
            <td>${stock}</td>
            <td><span class="${claseEstado}">${estado}</span></td>
            <td class="celda-acciones">
                <button class="boton-accion boton-editar" onclick="abrirModal('editar', 'servicio', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="boton-accion boton-eliminar" onclick="eliminarFila(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                    </svg>
                </button>
            </td>
        `

    mostrarNotificacion("Servicio agregado correctamente.", "exito")
  }

  cerrarModal()
}

function guardarUsuario() {
  const nombre = document.getElementById("nombre-usuario").value.trim()
  const email = document.getElementById("email-usuario").value.trim()
  const rol = document.getElementById("rol-usuario").value

  if (!nombre || !email || !rol) {
    mostrarNotificacion("Por favor, completa todos los campos.", "error")
    return
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    mostrarNotificacion("Por favor, ingresa un email válido.", "error")
    return
  }

  if (filaEditando) {
    // Editar usuario existente
    filaEditando.cells[1].textContent = nombre
    filaEditando.cells[2].textContent = email

    const rolSpan = filaEditando.cells[3].querySelector("span")
    rolSpan.textContent = rol
    rolSpan.className = rol === "Admin" ? "rol-admin" : rol === "Moderador" ? "rol-moderador" : "rol-cliente"

    mostrarNotificacion("Usuario actualizado correctamente.", "exito")
  } else {
    // Agregar nuevo usuario
    const cuerpoTabla = document.getElementById("cuerpo-tabla-usuarios")
    const nuevoId = Math.floor(Math.random() * 1000) + 100
    const nuevaFila = cuerpoTabla.insertRow()

    const claseRol = rol === "Admin" ? "rol-admin" : rol === "Moderador" ? "rol-moderador" : "rol-cliente"

    nuevaFila.innerHTML = `
            <td>${nuevoId}</td>
            <td>${nombre}</td>
            <td>${email}</td>
            <td><span class="${claseRol}">${rol}</span></td>
            <td class="celda-acciones">
                <button class="boton-accion boton-editar" onclick="abrirModal('editar', 'usuario', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="boton-accion boton-eliminar" onclick="eliminarFila(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                    </svg>
                </button>
            </td>
        `

    mostrarNotificacion("Usuario agregado correctamente.", "exito")
  }

  cerrarModal()
}

function eliminarFila(elemento) {
  const fila = elemento.closest("tr")
  const nombre = fila.cells[1].textContent

  if (confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
    fila.remove()
    mostrarNotificacion("Elemento eliminado correctamente.", "exito")
  }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function mostrarNotificacion(mensaje, tipo = "info") {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion notificacion-${tipo}`
  notificacion.textContent = mensaje

  // Estilos de la notificación
  Object.assign(notificacion.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "1000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    wordWrap: "break-word",
  })

  // Colores según el tipo
  switch (tipo) {
    case "exito":
      notificacion.style.background = "var(--color-exito)"
      break
    case "error":
      notificacion.style.background = "var(--color-peligro)"
      break
    case "advertencia":
      notificacion.style.background = "var(--color-advertencia)"
      break
    default:
      notificacion.style.background = "var(--color-primario)"
  }

  // Agregar al DOM
  document.body.appendChild(notificacion)

  // Animar entrada
  setTimeout(() => {
    notificacion.style.transform = "translateX(0)"
  }, 100)

  // Remover después de 3 segundos
  setTimeout(() => {
    notificacion.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion)
      }
    }, 300)
  }, 3000)
}

// ===== FUNCIONALIDAD DE SERVICIOS PÚBLICOS =====
function mostrarDetalleServicio(id) {
  const servicios = {
    1: {
      nombre: "Desarrollo Web Corporativo",
      precio: "$1,200.00",
      descripcion:
        "Creamos sitios web profesionales y modernos para empresas, con diseño responsivo y optimización SEO.",
      stock: 5,
      promocion: false,
    },
    2: {
      nombre: "Desarrollo de App Móvil",
      precio: "$3,500.00",
      descripcion:
        "Desarrollamos aplicaciones móviles nativas e híbridas para iOS y Android con las últimas tecnologías.",
      stock: 3,
      promocion: true,
    },
    3: {
      nombre: "Consultoría TI",
      precio: "$600.00",
      descripcion: "Asesoramiento especializado en tecnología para optimizar los procesos de tu empresa.",
      stock: 10,
      promocion: false,
    },
    4: {
      nombre: "Soporte Técnico 24/7",
      precio: "$300.00/mes",
      descripcion: "Soporte técnico continuo para garantizar el funcionamiento óptimo de tus sistemas.",
      stock: 15,
      promocion: true,
    },
  }

  const servicio = servicios[id]
  if (servicio) {
    alert(
      `${servicio.nombre}\n\nPrecio: ${servicio.precio}\nStock: ${servicio.stock}\nEn promoción: ${servicio.promocion ? "Sí" : "No"}\n\nDescripción: ${servicio.descripcion}`,
    )
  }
}

// ===== EVENTOS DE TECLADO =====
document.addEventListener("keydown", (e) => {
  // Cerrar modal con Escape
  if (e.key === "Escape" && modal.style.display === "flex") {
    cerrarModal()
  }
})

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar página de inicio por defecto
  mostrarPagina("pagina-inicio")

  // Agregar event listeners para cerrar modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModal()
    }
  })

  // Prevenir cierre del modal al hacer clic en el contenido
  const contenidoModal = document.querySelector(".contenido-modal")
  if (contenidoModal) {
    contenidoModal.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  console.log("TechSolutions - Sistema inicializado correctamente")
})

// ===== ANIMACIÓN DE SHAKE PARA ERRORES =====
const estiloShake = document.createElement("style")
estiloShake.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`
document.head.appendChild(estiloShake)
