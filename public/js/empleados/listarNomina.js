const url = 'http://localhost:8080/nomina';
const empleadoName = document.querySelector('#empleadoName');

const tbodyNominas = document.querySelector('#tbodyNominas');

const getNominas = async() => {
    
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'login.html'
        throw new Error('No hay token en el servidior');
    }

    const resp = await fetch('http://localhost:8080/auth/', {
        headers: {'x-token': token}
    });

    const { empleado: empleadoDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    empleado = empleadoDB;

    if (empleado.rol !== 'ADMIN') {
        document.getElementById('navEmpleados').remove();
    }

    empleadoName.innerText = empleado.nombre;
}