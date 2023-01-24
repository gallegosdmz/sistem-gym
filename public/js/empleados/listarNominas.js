const url = 'http://localhost:8080/nomina';
const empleadoName = document.querySelector('#empleadoName');

const tbodyNominas = document.querySelector('#tbodyNominas');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getNominas = async() => {
    const token = getToken();

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const { nominas } = await resp.json();

    return nominas;
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

const renderNominas = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="empleado.html?id=${x.uid}">${x.empleado.nombre}</a> </td>
            <td> ${x.empleado.apellido} </td>
            <td> ${x.empleado.correo} </td>
            <td> ${x.sueldo_neto} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyNominas.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getNominas().then(renderNominas);
}

main();