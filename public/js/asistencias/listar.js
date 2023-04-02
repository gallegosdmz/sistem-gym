const url = 'http://localhost:8080/asistencia';
const empleadoName = document.querySelector('#empleadoName');

const tbodyAsistencias = document.querySelector('#tbdoyAsistencias');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getAsistencias = async() => {
    const resp  = await fetch(`${url}?limite=100`, {
        headers: {'x-token': getToken()}
    });

    const { asistencias } = await resp.json();

    return asistencias;
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

const main = async() => {
    await validarJWT();
}