const url = 'http://localhost:8080/categoria';
const empleadoName = document.querySelector('#empleadoName');

const formulario = document.querySelector('#formulario');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

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

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const token = getToken();

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(({errors}) => {
        if (errors) {
            return document.getElementById('errorNombre').classList.remove('d-none');
        }

        window.location = 'listar.html';
    })
    .catch(err => {
        console.log(err);
    })

});

const main = async() => {
    await validarJWT();
}

main();