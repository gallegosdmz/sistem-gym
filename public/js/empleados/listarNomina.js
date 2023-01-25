const url = 'http://localhost:8080/nomina/';
const empleadoName = document.querySelector('#empleadoName');

const idP = document.querySelector('#idP');
const nombreP = document.querySelector('#nombreP');
const apellidoP = document.querySelector('#apellidoP');
const correoP = document.querySelector('#correoP');
const baseP = document.querySelector('#baseP');
const horasexP = document.querySelector('#horasexP');
const preciohorasP = document.querySelector('#preciohorasP');
const totalhorasP = document.querySelector('#totalhorasP');
const bonoP = document.querySelector('#bonoP');
const totalasigP = document.querySelector('#totalasigP');
const adelantoP = document.querySelector('#adelantoP');
const brutoP = document.querySelector('#brutoP');
const isrP = document.querySelector('#isrP');
const netoP = document.querySelector('#netoP');

const btnEditar = document.querySelector('#btnEditar');
const btnBorrar = document.querySelector('#btnBorrar');
const modal = document.getElementById("ventanaModal");
const span = document.getElementsByClassName("cerrar")[0];
const confEliminar = document.querySelector('#confEliminar');
const confSalir = document.querySelector('#confSalir');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getNomina = async() => {
    const token = getToken();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { nomina } = await resp.json();

    return nomina;
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

const renderQoute = (nomina) => {
    idP.innerText = nomina.uid;
    nombreP.innerText = nomina.empleado.nombre;
    apellidoP.innerText = nomina.empleado.apellido;
    correoP.innerText = nomina.empleado.correo;
    baseP.innerText = nomina.sueldo_base;
    horasexP.innerText = nomina.horas_extra;
    preciohorasP.innerText = nomina.precio_horas;
    totalhorasP.innerText = nomina.total_horas;
    bonoP.innerText = nomina.bono_transportes;
    totalasigP.innerText = nomina.total_asignaciones;
    adelantoP.innerText = nomina.adelanto_sueldo;
    brutoP.innerText = nomina.sueldo_bruto;
    isrP.innerText = nomina.isr;
    netoP.innerText = nomina.sueldo_neto;
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
    const token = getToken();

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
    getNomina().then(renderQoute);
}

main();