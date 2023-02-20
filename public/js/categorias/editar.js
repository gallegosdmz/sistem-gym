const url = 'http://localhost:8080/categoria/';
const empleadoName = document.querySelector('#empleadoName');

const formulario = document.querySelector('#formulario');

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

const renderData = ({nombre}) => {
    document.getElementById('nombreInput').value = nombre;
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const token = getToken();
    const id = getId();

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(`${url}${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(({msg}) => {
        if (msg) {
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
    getCategoria().then(renderData)
}

main();