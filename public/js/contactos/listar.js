const url = 'http://localhost:8080/contacto';
const empleadoName = document.querySelector('#empleadoName');

const tbodyContactos = document.querySelector('#tbodyContactos');

const getContactos = async() => {
    const token = localStorage.getItem('token') || '';

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const { contactos } = await resp.json();

    return contactos;
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

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

const renderQoute = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="contacto.html?id=${x.uid}">${x.nombre}</a> </td>
            <td> ${x.apellido} </td>
            <td> ${x.telefono} </td>
            <td> ${x.parentesco} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyContactos.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getContactos().then(renderQoute);
}

main();