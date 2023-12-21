//--------------------------------variables------------------------------//
let empleados;
let modificar = false;
let pos;
let modo = $("#modo").val();
let fecha = new Date();
fecha.setMinutes(fecha.getMinutes() + 1);
fecha = fecha.toUTCString();
console.log(fecha);
cargarEmpleados();
llenarTabla();
//--------------------------------funciones------------------------------//
function cargarEmpleados() {
    switch (modo) {
        case "session":
            empleados = sessionStorage.getItem("empleados");
            break;
        case "cookies":
            empleados = document.cookie.split('=')[1];
            break;
        default:
            empleados = localStorage.getItem("empleados");;
            break;
    };
    if (empleados != null) {
        empleados = JSON.parse(empleados);
    } else {
        empleados = [];
    }
}

function agregarEmpleado() {
    let empleado = {
        nombre: $("#nombre").val(),
        apellido: $("#apellido").val(),
        correo: $("#correo").val(),
        telefono: $("#telefono").val()
    };
    empleados.push(empleado);
    guardar();
    llenarTabla();
    limpiar();
}

function guardar() {
    switch (modo) {
        case "session":
            sessionStorage.setItem("empleados", JSON.stringify(empleados));
            break;
        case "cookies":
            document.cookie = `empleados=${JSON.stringify(empleados)};expires=${fecha};path=/;`;
            break;
        default:
            localStorage.setItem("empleados", JSON.stringify(empleados));
    }
}

function Editar() {
    empleados[pos] = {
        nombre: $("#nombre").val(),
        apellido: $("#apellido").val(),
        correo: $("#correo").val(),
        telefono: $("#telefono").val()
    };
    guardar();
    modificar = false;
    llenarTabla();
    limpiar();

}

function Eliminar(pos) {
    empleados.splice(pos, 1);
    guardar();
}

function limpiar() {
    $("#nombre").val([])
    $("#apellido").val([])
    $("#correo").val([]),
        $("#telefono").val([])
}

function llenarTabla() {
    $("#empleados-tabla").html(
        "<thead class='table-dark'" +
        "<tr>" +
        "<th> Nombre </th>" +
        "<th> Apellido </th>" +
        "<th> Correo </th>" +
        "<th> Teléfono </th>" +
        "<th> Acciones </th>" +
        "</tr>" +
        "</thead>"
    );
    for (let empleado of empleados) {

        $("#empleados-tabla").append(
            "<tr>" +
            "<td>" + empleado.nombre + "</td>" +
            "<td>" + empleado.apellido + "</td>" +
            "<td>" + empleado.correo + "</td>" +
            "<td>" + empleado.telefono + "</td>" +
            "<td>" +
            "<button id='" + empleados.indexOf(empleado) + "'class='btnEditar btn btn-warning btn-sm me-2'>Modificar</button>" +
            "<button id='" + empleados.indexOf(empleado) + "' class='btnEliminar btn btn-danger btn-sm'>Eliminar</button>" +
            "</td>" +
            "</tr>"
        );
    }
}

$("#empleados-form").bind("submit", function(event) {
    event.preventDefault();
    if (modificar === false) {
        return agregarEmpleado();
    }
    return Editar();

});

$(document).on("click", ".btnEditar", function() {
    modificar = true;
    pos = $(this).attr("id");
    let empleado = empleados[pos];
    $("#nombre").val(empleado.nombre);
    $("#apellido").val(empleado.apellido);
    $("#correo").val(empleado.correo);
    $("#telefono").val(empleado.telefono);
    $("#nombre").focus();
});

$(document).on("click", ".btnEliminar", function() {
    pos = $(this).attr("id");
    Eliminar(pos);
    llenarTabla();
});

$("#modo").change(function() {
    modo = $("#modo").val();
    cargarEmpleados();
    llenarTabla();
})