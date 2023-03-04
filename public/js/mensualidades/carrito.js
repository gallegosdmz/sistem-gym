const url = 'http://localhost:8080/venta';
const url_num = 'http://localhost:8080/venta/numeroVenta';
const url_mensualidad = 'http://localhost:8080/mensualidad/';

const empleadoName = document.querySelector('#empleadoName');

const getToken = () => { 
    return localStorage.getItem('token') || '';
}

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
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
        document.getElementById('navGanancias').remove();
        document.getElementById('navNominas').remove();
    }

    empleadoName.innerText = empleado.nombre;
}

const updateCarrito = async() => {
    const id = getId();
    const token = getToken();

    let active = localStorage.getItem('active') || false;
    let mensualidade = localStorage.getItem('mensualidad') || '';

    
}

const main = async() => {
    await validarJWT();
}