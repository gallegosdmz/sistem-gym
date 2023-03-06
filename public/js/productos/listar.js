const url = 'http://localhost:8080/producto';
const empleadoName = document.querySelector('#empleadoName');

const tbodyProductos = document.querySelector('#tbodyProductos');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getProductos = async() => {
    const token = getToken();

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const { productos } = await resp.json();

    return productos;
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

const renderProductos = (data) => {
    let disponbile = 'Si';

    data.forEach(x => {
        if (!disponbile) {
            disponbile = 'No';
        }

        const html = `
            <td> <a href="cliente.html?id=${x.uid}">${x.nombre}</a> </td>
            <td> $${x.precio_venta} </td>
            <td> $${x.precio_compra} </td>
            <td> ${x.stock} </td>
            <td> ${disponbile} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyProductos.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getProductos().then(renderProductos);
}

main();