const url = 'http://localhost:8080/empleado';
const empleadoName = document.querySelector('#empleadoName');

const tbodyEmpleados = document.querySelector('#tbodyEmpleados');

const getEmpleados = async() => {
    const token = localStorage.getItem('token') || '';

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const {empleados} = await resp.json();

    return empleados;
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
        window.location = '../../index.html';
    }

    empleadoName.innerText = empleado.nombre;
}

const renderQoute = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="empleado.html?id=${x.uid}">${x.nombre}</a> </td>
            <td> ${x.apellido} </td>
            <td> ${x.telefono} </td>
            <td> ${x.rol} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyEmpleados.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getEmpleados().then(renderQoute);
}

main();
