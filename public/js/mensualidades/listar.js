const url = 'http://localhost:8080/mensualidad';
const empleadoName = document.querySelector('#empleadoName');

const tbodyMensualidades = document.querySelector('#tbodyMensualidades');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getMensualidades = async() => {
    const token = getToken();

    const resp = await fetch(`${url}?limite=20`, {
        headers: {'x-token': token}
    });

    const { mensualidades } = await resp.json();

    return mensualidades;
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

const renderQoute = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="mensualidad.html?id=${x.uid}">${x.tipo}</a> </td>
            <td> ${x.precio} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyMensualidades.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getMensualidades().then(renderQoute);
}

main();