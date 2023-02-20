const url = 'http://localhost:8080/categoria/';
const empleadoName = document.querySelector('#empleadoName');

const tbodyCategorias = document.querySelector('#tbodyCategorias');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getCategorias = async() => {
    const token = getToken();

    const resp = await fetch(`${url}?limite=100`, {
        headers: {'x-token': token}
    });

    const { categorias } = await resp.json();

    return categorias;
}

const validarJWT = async() => {
    const token = getToken();

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

const renderQoute = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="categoria.html?id=${x.uid}">${x.nombre}</a> </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyCategorias.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    getCategorias().then(renderQoute);
}

main();