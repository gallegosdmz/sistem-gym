const url = 'http://localhost:8080/categoria/';
const empleadoName = document.querySelector('#empleadoName');

const idP = document.getElementById('idP');
const nombreP = document.getElementById('nombreP');

const empleadoNombreP = document.getElementById('empleadoNombreP');
const empleadoApellidoP = document.getElementById('empleadoApellidoP');
const empleadoCorreoP = document.getElementById('empleadoCorreoP');

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

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getCategoria = async() => {
    const token = getToken();
    const id = getId();

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { categoria } = await resp.json();

    return categoria;
}

const validarJWT = async() => {
    const token = getToken();

    if (token.length <= 10) {
        window.location = 'login.html';
        throw new Error('No hay token en el servidor');
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

const errorSearchId = () => {
    modal_id.style.display = "block";

    confBuscar.addEventListener('click', () => {
        const id = document.getElementById('inputModal').value;
        
        window.location = `categoria.html?id=${id}`;
    });

    confCancelar.addEventListener('click', () => {
        window.location = 'listar.html';
    });
}

const renderQoute = (categoria) => {
    if (!categoria) {
        errorSearchId();
    }

    idP.innerText = categoria.uid;
    nombreP.innerText = categoria.nombre;
    
    if (!categoria.empleado.estado) {
        document.getElementById('errorEmpleado').classList.remove('d-none');

        document.getElementById('nombreB').classList.add('d-none');
        document.getElementById('nombreB').classList.remove('d-inline');
        document.getElementById('apellidoB').classList.add('d-none');
        document.getElementById('apellidoB').classList.remove('d-inline');
        document.getElementById('correoB').classList.add('d-none');
        document.getElementById('correoB').classList.remove('d-inline');
    } else {
        empleadoNombreP.innerText = empleado.nombre;
        empleadoApellidoP.innerText = empleado.apellido;
        empleadoCorreoP.innerText = empleado.correo;
    }
}

btnEditar.addEventListener('click', () => {
    const id = getId();

    window.location = `editar.html?id=${id}`;
});

btnBorrar.addEventListener('click', () => {
    modal.style.display = "block";

});

span.addEventListener('click', () => {
    modal.style.display = "none";
});

confEliminar.addEventListener('click', () => {
    const token = getToken();

    const id = getId();

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
    getCategoria().then(renderQoute)
}

main();