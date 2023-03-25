const url = 'http://localhost:8080/asistencia/';

const formulario = document.querySelector('#formulario');

const getToken = () => {
    return localStorage.getItem('token') || '';
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

}

const resetErrors = () => {
    document.getElementById('errorCorreo').classList.add('d-none');
    document.getElementById('errorMensualidad').classList.add('d-none');
    document.getElementById('successCorreo').classList.add('d-none');
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    resetErrors();

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
    .then(({msg}) => {
        if (msg == 'El correo no existe') {
            document.getElementById('errorCorreo').classList.remove('d-none');
        } else if (msg == 'La mensualidad está vencida') {
            document.getElementById('errorMensualidad').classList.remove('d-none');
        } else {
            document.getElementById('successCorreo').classList.remove('d-none');
        }
    })
    .catch(err => {
        console.log(err);
    })

});

const main = async() => {
    await validarJWT();
}

main();