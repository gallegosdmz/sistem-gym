const url = 'http://localhost:8080/empleado/';
const empleadoName = document.querySelector('#empleadoName');

const idP = document.querySelector('#idP');
const nombreP = document.querySelector('#nombreP');
const apellidoP = document.querySelector('#apellidoP');
const correoP = document.querySelector('#correoP');
const curpP = document.querySelector('#curpP');
const rfcP = document.querySelector('#rfcP');
const seguroP = document.querySelector('#seguroP');
const lugarnacP = document.querySelector('#lugarnacP');
const sexoP = document.querySelector('#sexoP');
const civilP = document.querySelector('#civilP');
const fechanacP = document.querySelector('#fechanacP');
const telefonoP = document.querySelector('#telefonoP');
const direccionP = document.querySelector('#direccionP');
const rolP = document.querySelector('#rolP');
const contactoNombreP = document.querySelector('#contactoNombreP');
const contactoApellidoP = document.querySelector('#contactoApellidoP');
const contactoTelefonoP = document.querySelector('#contactoTelefonoP');

const btnEditar = document.querySelector('#btnEditar');
const btnBorrar = document.querySelector('#btnBorrar');
const modal = document.getElementById("ventanaModal");
const span = document.getElementsByClassName("cerrar")[0];
const confEliminar = document.querySelector('#confEliminar');
const confSalir = document.querySelector('#confSalir');

const modal_id = document.getElementById("ventanaModalId");
const span_id = document.getElementsByClassName("cerrar")[1];
const confBuscar = document.querySelector('#confBuscar');
const confCancelar = document.querySelector('#confCancelar');

const getEmpleado = async() => {
    const token = localStorage.getItem('token') || '';

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { empleado } = await resp.json();

    return empleado;
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'login.html';
        throw new Error('No hay token en la petición');
    }

    const resp = await fetch('http://localhost:8080/auth/', {
        headers: {'x-token': token}
    });

    const { empleado: empleadoDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    empleado = empleadoDB;

    if (empleado.rol !== 'ADMIN') {
        window.location = '../../index.html';
    }

    empleadoName.innerText = empleado.nombre;
}

const renderQoute = (empleado) => {
    if (!empleado) {
        errorSearchId();
    }

    idP.innerText = empleado.uid;
    nombreP.innerText = empleado.nombre;
    apellidoP.innerText = empleado.apellido;
    correoP.innerText = empleado.correo;
    curpP.innerText = empleado.curp;
    rfcP.innerText = empleado.rfc;
    seguroP.innerText = empleado.num_seguro;
    lugarnacP.innerText = empleado.lugar_nacimiento;
    sexoP.innerText = empleado.sexo;
    civilP.innerText = empleado.estado_civil;
    fechanacP.innerText = empleado.fecha_nac;
    telefonoP.innerText = empleado.telefono;
    direccionP.innerText = empleado.direccion;
    rolP.innerText = empleado.rol;

    if (!empleado.contacto.estado) {
        document.getElementById('errorContacto').classList.remove('d-none');
        
        document.getElementById('nombreB').classList.add('d-none');
        document.getElementById('nombreB').classList.remove('d-inline');
        document.getElementById('apellidoB').classList.add('d-none');
        document.getElementById('apellidoB').classList.remove('d-inline');
        document.getElementById('telefonoB').classList.add('d-none');
        document.getElementById('telefonoB').classList.remove('d-inline');
    } else {
        contactoNombreP.innerText = empleado.contacto.nombre;
        contactoApellidoP.innerText = empleado.contacto.apellido;
        contactoTelefonoP.innerText = empleado.contacto.telefono;
    }
}

const errorSearchId = () => {
    modal_id.style.display = "block";

    confBuscar.addEventListener('click', () => {
        const id = document.getElementById('inputModal').value;
        
        window.location = `empleado.html?id=${id}`;
    });

    confCancelar.addEventListener('click', () => {
        window.location = 'listar.html';
    });
}

btnEditar.addEventListener('click', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    window.location = `editar.html?id=${id}`;
});

btnBorrar.addEventListener('click', () => {
    modal.style.display = "block";

});

span.addEventListener('click', () => {
    modal.style.display = "none";
});

confEliminar.addEventListener('click', () => {
    const token = localStorage.getItem('token') || '';

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    fetch(`${url}${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(({errors}) => {
        if (errors) {
            return console.error(errors);
        }

        window.location = 'listar.html';
    })
    .catch(err => {
        console.log(err);
    })
});

confSalir.addEventListener('click', () => {
    modal.style.display = "none";
});

const main = async() => {
    await validarJWT();
    getEmpleado().then(renderQoute);
}

main();