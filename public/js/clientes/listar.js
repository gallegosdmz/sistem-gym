const url = 'http://localhost:8080/cliente';
const empleadoName = document.querySelector('#empleadoName');

const tbodyClientes = document.querySelector('#tbodyClientes');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getClientes = async() => {
    const token = getToken();

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const { clientes } = await resp.json();
    

    return clientes;
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
            <td> <a href="cliente.html?id=${x.uid}">${x.nombre}</a> </td>
            <td> ${x.apellido} </td>
            <td> ${x.telefono} </td>
            <td> ${x.mensualidad} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyClientes.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getClientes().then(renderQoute);
}

main();