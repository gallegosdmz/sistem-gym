const url = 'http://localhost:8080/cliente/';
const empleadoName = document.querySelector('#empleadoName');

const nombreP = document.querySelector('#nombreP');
const apellidoP = document.querySelector('#apellidoP');
const correoP = document.querySelector('#correoP');
const telefonoP = document.querySelector('#telefonoP');
const mensualidadP = document.querySelector('#mensualidadP');
const fechapagoP = document.querySelector('#fechapagoP');

const btnEditar = document.querySelector('#btnEditar');
const btnBorrar = document.querySelector('#btnBorrar');
const modal = document.getElementById("ventanaModal");
const span = document.getElementsByClassName("cerrar")[0];
const confEliminar = document.querySelector('#confEliminar');
const confSalir = document.querySelector('#confSalir');

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}
 
const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getCliente = async() => {
    const token = getToken();
    const id = getId();

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { cliente } = await resp.json();

    return cliente;
}

const validarJWT = async() => {
    const token = getToken();

    if (token.length <= 10) {
        window.location = '../empleados/login.html';

        throw new Error('No hay token en la petición');
    }

    const resp = await fetch('http://localhost:8080/auth/', {
        headers: {'x-token': token}
    });

    const { empleado: empleadoDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    empleado = empleadoDB;

    if (empleado.rol !== 'ADMIN' && empleado.rol !== 'ENTRENADOR' && empleado.rol !== 'RECEPCIONISTA') {
        window.location = '../../index.html';
    }

    if (empleado.rol !== 'ADMIN') {
        document.getElementById('navEmpleados').remove();
    }

    empleadoName.innerText = empleado.nombre;
}

const renderQoute = (cliente) => {
    const date = cliente.fecha_pago.slice(0, 10);

    idP.innerText = cliente.uid;
    nombreP.innerText = cliente.nombre;
    apellidoP.innerText = cliente.apellido;
    correoP.innerText = cliente.correo;
    telefonoP.innerText = cliente.telefono;
    mensualidadP.innerText = cliente.mensualidad.tipo;
    fechapagoP.innerText = date;
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
    getCliente().then(renderQoute);
}

main();