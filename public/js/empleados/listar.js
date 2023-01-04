const url = 'http://localhost:8080/empleado';
const empleadoName = document.querySelector('#empleadoName');

const tbodyEmpleados = document.querySelector('#tbodyEmpleados');

const getEmpleados = async() => {
    const token = localStorage.getItem('token') || '';

    const resp = await fetch(`${url}`, {
        headers: {'x-token': token}
    });

    const {empleados} = await resp.json();

    console.log(empleados);

    return empleados;
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'pages/empleados/login.html'
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

const renderQoute = (data) => {
    data.forEach(x => {
        const html = `
            <td> ${x.nombre} </td>
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
