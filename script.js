// Mostrar y ocultar pantallas
function mostrarLogin() {
    ocultarTodo();
    document.getElementById("pantalla-login").style.display = "flex";
}

function mostrarRegistro() {
    ocultarTodo();
    document.getElementById("pantalla-registro").style.display = "flex";
}

function volverInicio() {
    ocultarTodo();
    document.getElementById("pantalla-bienvenida").style.display = "block";
}

function mostrarFormularioAlimento() {
    ocultarTodo();
    document.getElementById("pantalla-alimento").style.display = "flex";
}

function volverDashboard() {
    ocultarTodo();
    document.getElementById("pantalla-dashboard").style.display = "block";
    mostrarAlimentos();
}

function mostrarDirecciones() {
    ocultarTodo();
    document.getElementById("pantalla-direcciones").style.display = "block";
    cargarDirecciones();
}

// Función general para ocultar todas las pantallas
function ocultarTodo() {
    const pantallas = [
        "pantalla-bienvenida",
        "pantalla-login",
        "pantalla-registro",
        "pantalla-dashboard",
        "pantalla-alimento",
        "formulario-edicion",
        "pantalla-direcciones"
    ];
    pantallas.forEach(id => document.getElementById(id).style.display = "none");
}

// Simulación de inicio de sesión
// guardar sesión: en sessionStorage
function setUserSession(user) {
    sessionStorage.setItem('miDespensaUser', JSON.stringify(user));
}

function getUserSession() {
    const s = sessionStorage.getItem('miDespensaUser');
    return s ? JSON.parse(s) : null;
}

// Simulación de registro
async function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const pass = document.getElementById('reg-pass').value;

    const resp = await fetch('api/register.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre, correo, pass })
    });
    const data = await resp.json();
    if (data.ok) {
        alert('Usuario registrado correctamente 📝');
        // hacer login simple: obtener id (data.user_id)
        setUserSession({ id: data.user_id, nombre });
        ocultarTodo();
        document.getElementById('pantalla-dashboard').style.display = 'block';
        mostrarAlimentos();
    } else {
        alert('Error: ' + (data.msg || 'No se pudo registrar'));
    }
}

async function iniciarSesion(event) {
    event.preventDefault();
    const correo = document.getElementById('login-correo').value.trim();
    const pass = document.getElementById('login-pass').value;

    const resp = await fetch('api/login.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo, pass })
    });
    const data = await resp.json();
    if (data.ok) {
        setUserSession(data.user);
        alert('Inicio de sesión exitoso ✅');
        ocultarTodo();
        document.getElementById('pantalla-dashboard').style.display = 'block';
        mostrarAlimentos();
    } else {
        alert('Error: ' + (data.msg || 'Credenciales incorrectas'));
    }
}

// Cerrar sesión
async function cerrarSesion() {
    await fetch('api/logout.php');
    sessionStorage.removeItem('miDespensaUser');
    alert('Has cerrado sesión 👋');
    volverInicio();
}


// === FUNCIONES DE EDICIÓN ===
let alimentoEditando = null;

function editarAlimento(item) {
    ocultarTodo();
    document.getElementById("formulario-edicion").style.display = "flex";
    alimentoEditando = item; // objeto con id, nombre, fecha...
    document.getElementById("editar-nombre").value = item.nombre;
    document.getElementById("editar-fecha").value = item.fecha;
}

async function guardarCambios(event) {
    event.preventDefault();
    const user = getUserSession();
    if (!user || !alimentoEditando) return alert('Error de sesión o edición');

    const nombre = document.getElementById("editar-nombre").value.trim();
    const fecha = document.getElementById("editar-fecha").value;
    if (!nombre || !fecha) return alert("Por favor completa todos los campos 🍏");

    const payload = { id: alimentoEditando.id, user_id: user.id, nombre, fecha };
    const resp = await fetch('api/update_alimento.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (data.ok) {
        alert('✅ Cambios guardados correctamente');
        volverDashboard();
    } else {
        alert('Error al actualizar: ' + (data.msg || ''));
    }
}

async function eliminarAlimento(id) {
    const user = getUserSession();
    if (!user) return alert('Debes iniciar sesión');
    if (!confirm('¿Eliminar este alimento?')) return;

    const resp = await fetch('api/delete_alimento.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, user_id: user.id })
    });
    const data = await resp.json();
    if (data.ok) {
        mostrarAlimentos();
    } else {
        alert('Error al eliminar: ' + (data.msg || ''));
    }
}

async function eliminarActual() {
    if (!alimentoEditando) return;
    await eliminarAlimento(alimentoEditando.id);
    volverDashboard();
}

// Agregar un alimento nuevo
async function guardarAlimento(event) {
    event.preventDefault();

    const user = getUserSession();
    if (!user) {
        alert('Debes iniciar sesión para guardar alimentos');
        return;
    }

    const nombre = document.getElementById("nombre-alimento").value.trim();
    const fecha = document.getElementById("fecha-vencimiento").value;

    if (!nombre || !fecha) {
        alert("Por favor completa todos los campos 🍎");
        return;
    }

    // obtener info de OpenFoodFacts (ya tienes la función)
    const resultadoAPI = await obtenerInfoOpenFoodFactsParaGuardar(nombre);

    const payload = {
        user_id: user.id,
        nombre,
        fecha,
        nombreAPI: resultadoAPI.nombreAPI,
        infoNutricional: resultadoAPI.infoNutricional
    };

    const resp = await fetch('api/add_alimento.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (data.ok) {
        document.getElementById("nombre-alimento").value = "";
        document.getElementById("fecha-vencimiento").value = "";
        alert("✅ Alimento guardado correctamente");
        volverDashboard();
    } else {
        alert("Error al guardar el alimento: " + (data.msg || ''));
    }
}

// Contador de visitas
async function actualizarContador() {
    const resp = await fetch("api/contador.php");
    const data = await resp.json();
    if (data.ok) {
        document.getElementById("contadorVisitas").textContent = `👀 Visitas totales: ${data.total}`;
    }
}

document.addEventListener("DOMContentLoaded", actualizarContador);

// Funciones para la libreta de direcciones
async function guardarDireccion(event) {
    event.preventDefault();
    const user = getUserSession();
    if (!user) return alert("Debes iniciar sesión");

    const nombre = document.getElementById("dir-nombre").value.trim();
    const telefono = document.getElementById("dir-telefono").value.trim();
    const direccion = document.getElementById("dir-direccion").value.trim();
    const correo = document.getElementById("dir-correo").value.trim();

    const resp = await fetch("api/add_direccion.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id: user.id, nombre, telefono, direccion, correo})
    });
    const data = await resp.json();

    if (data.ok) {
        alert("✅ Dirección guardada");
        document.getElementById("form-direccion").reset();
        cargarDirecciones();
    } else {
        alert("Error: " + data.msg);
    }
}

async function cargarDirecciones() {
    const user = getUserSession();
    const lista = document.getElementById("listaDirecciones");
    lista.innerHTML = "";

    const resp = await fetch(`api/get_direcciones.php?user_id=${user.id}`);
    const data = await resp.json();

    if (!data.ok || !data.direcciones.length) {
        lista.innerHTML = "<li class='list-group-item'>No hay direcciones guardadas.</li>";
        return;
    }

    data.direcciones.forEach(dir => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `<div><strong>${dir.nombre}</strong><br>📞 ${dir.telefono}<br>🏠 ${dir.direccion}<br>📧 ${dir.correo}</div>`;
        
        const btn = document.createElement("button");
        btn.textContent = "❌";
        btn.className = "btn btn-sm btn-danger";
        btn.onclick = async () => {
            if (confirm("¿Eliminar esta dirección?")) {
                await fetch("api/delete_direccion.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id: dir.id, user_id: user.id})
                });
                cargarDirecciones();
            }
        };

        li.appendChild(btn);
        lista.appendChild(li);
    });
}

// === FUNCIÓN PARA CAMBIAR ENTRE MODO CLARO Y OSCURO ===
function cambiarTema() {
    const body = document.body;
    body.classList.toggle('bg-light');
    body.classList.toggle('bg-dark');

    // Guardar el estado del modo en localStorage
    if (body.classList.contains("bg-dark")) {
        localStorage.setItem("modoOscuro", "true");
    } else {
        localStorage.setItem("modoOscuro", "false");
    }
}

// === MASHUP: Información nutricional usando Open Food Facts (API gratuita) ===

// Escucha cuando el usuario termina de escribir un alimento
document.getElementById("nombre-alimento").addEventListener("blur", function() {
    const nombre = this.value.trim();
    if (nombre) {
        obtenerInfoOpenFoodFacts(nombre);
    }
});

// Función principal para consultar la API
async function obtenerInfoOpenFoodFacts(nombre) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(nombre)}&search_simple=1&action=process&json=1`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.products && datos.products.length > 0) {
            const producto = datos.products[0]; // Tomamos el primero encontrado

            const energia = producto.nutriments["energy-kcal_100g"] || "N/D";
            const grasas = producto.nutriments.fat_100g || "N/D";
            const proteinas = producto.nutriments.proteins_100g || "N/D";
            const carbohidratos = producto.nutriments.carbohydrates_100g || "N/D";

            const info = `
                🍽️ <strong>${producto.product_name || nombre}</strong><br>
                Energía: ${energia} kcal / 100g<br>
                Grasas: ${grasas} g<br>
                Proteínas: ${proteinas} g<br>
                Carbohidratos: ${carbohidratos} g
            `;
            mostrarInfoNutricional(info);
        } else {
            mostrarInfoNutricional("No se encontró información nutricional para este alimento 🍏");
        }
    } catch (error) {
        console.error("Error al consultar Open Food Facts:", error);
        mostrarInfoNutricional("❌ Error al obtener datos nutricionales");
    }
}

// Obtiene los datos del API y devuelve texto plano
async function obtenerInfoOpenFoodFactsParaGuardar(nombre) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(nombre)}&search_simple=1&action=process&json=1`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.products && datos.products.length > 0) {
            const producto = datos.products[0];

            const nombreAPI = producto.product_name || nombre; // nombre real del producto
            const energia = producto.nutriments["energy-kcal_100g"] || "N/D";
            const grasas = producto.nutriments.fat_100g || "N/D";
            const proteinas = producto.nutriments.proteins_100g || "N/D";
            const carbohidratos = producto.nutriments.carbohydrates_100g || "N/D";

            // devolvemos todo como objeto
            return {
                nombreAPI,
                infoNutricional: `Energía: ${energia} kcal / 100g | Grasas: ${grasas} g | Proteínas: ${proteinas} g | Carbohidratos: ${carbohidratos} g`
            };
        } else {
            return {
                nombreAPI: nombre,
                infoNutricional: "Sin información nutricional disponible."
            };
        }
    } catch (error) {
        console.error("Error al consultar Open Food Facts:", error);
        return {
            nombreAPI: nombre,
            infoNutricional: "Error al obtener datos nutricionales."
        };
    }
}

async function mostrarAlimentos() {
    const listaAlimentos = document.getElementById('listaAlimentos');
    listaAlimentos.innerHTML = "";

    const user = getUserSession();
    if (!user) {
        listaAlimentos.innerHTML = "<li class='list-group-item'>Inicia sesión para ver tus alimentos.</li>";
        return;
    }

    document.getElementById('nombreUsuario').textContent = user.nombre; // Mostrar nombre del usuario

    const resp = await fetch(`api/get_alimentos.php?user_id=${user.id}`);
    const data = await resp.json();
    if (!data.ok) {
        listaAlimentos.innerHTML = "<li class='list-group-item'>Error al cargar alimentos.</li>";
        return;
    }

    const alimentos = data.alimentos || [];
    if (alimentos.length === 0) {
        listaAlimentos.innerHTML = "<li class='list-group-item'>No hay alimentos registrados.</li>";
        return;
    }

    const hoy = new Date().toISOString().split("T")[0];

    alimentos.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center mb-3";

        const contenido = document.createElement('div');
        contenido.innerHTML = `
            <div>
                <strong>🍽 ${item.nombre}</strong><br>
                <small>📅 Vence: ${item.fecha}</small><br>
                <small>🧾 Receta: ${item.nombreAPI || "No disponible"}</small><br>
                <small>🥦 ${item.infoNutricional || "Sin datos nutricionales"}</small>
            </div>
        `;
        li.appendChild(contenido);

        // Color según vencimiento
        li.style.backgroundColor = (item.fecha < hoy) ? "#f8d7da" : "#d4edda";

        const botones = document.createElement('div');

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏";
        btnEditar.className = "btn btn-sm btn-warning ms-2";
        btnEditar.onclick = () => editarAlimento(item); // ahora pasamos objeto

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.className = "btn btn-sm btn-danger ms-2";
        btnEliminar.onclick = () => eliminarAlimento(item.id);

        botones.appendChild(btnEditar);
        botones.appendChild(btnEliminar);

        li.appendChild(botones);
        listaAlimentos.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", mostrarAlimentos);

// Mostrar la información debajo del formulario de registro
function mostrarInfoNutricional(infoHTML) {
    let infoDiv = document.getElementById("info-nutricional");
    if (!infoDiv) {
        infoDiv = document.createElement("div");
        infoDiv.id = "info-nutricional";
        infoDiv.className = "mt-3 alert alert-info";
        document.getElementById("form-alimento").appendChild(infoDiv);
    }
    infoDiv.innerHTML = infoHTML;
}
