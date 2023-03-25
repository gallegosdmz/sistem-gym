const url = 'http://localhost:8080/turno/';
const url_asistencia = 'http://localhost:8080/asistencia';
const url_cliente = 'http://localhost:8080/cliente/mensualidad';

const empleadoName = document.querySelector('#empleadoName');
const btnIniciar = document.getElementById('btnIniciar');
const btnTerminar = document.getElementById('btnTerminar');
const tbodyClientesVencidos = document.getElementById('tbodyClientesVencidos');

const getId = () => {
    const id = localStorage.getItem('idTurno');

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const validarMensualidades = async() => {
    const resp = await fetch(url_cliente, {
        method: 'PUT',
        headers: {'x-token': getToken()}
    });

    const { clientesVencidos } = await resp.json();

    return clientesVencidos;
}

const getAsistencias = async() => {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString();
    const array = fecha.split('/');

    let fechaActual = '';

    if (array[1].length === 1) {
         fechaActual = array[2] + "-0" + array[1] + "-" + array[0];
    } else {
         fechaActual = array[2] + "-" + array[1] + "-" + array[0];
    }

    const resp = await fetch(`${url_asistencia}/pasada?fecha=${fechaActual}`, {
        headers: {'x-token': getToken()}
    });

    const { asistencias } = await resp.json();

    return asistencias;
}

const validarJWT = async() => {
    const token = getToken();

    if (token.length <= 10) {
        window.location = 'pages/empleados/login.html'
        throw new Error('No hay token en el servidor');
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

    if (localStorage.getItem('turnoActivo') === 'true') {
        document.getElementById('btnIniciar').classList.remove('d-sm-inline-block');
        document.getElementById('btnTerminar').classList.add('d-sm-inline-block');
    }

    empleadoName.innerText = empleado.nombre;
}

btnIniciar.addEventListener('click', async() => {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString();
    const array = fecha.split('/');

    let fechaActual = '';

    if (array[1].length === 1) {
         fechaActual = array[2] + "-0" + array[1] + "-" + array[0];
    } else {
         fechaActual = array[2] + "-" + array[1] + "-" + array[0];
    }

    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();


    let turnoActivo = false;
    let turno = {};

    if (localStorage.getItem('turnoPasado')) {
        let arrayAsistencias = [];

        await getAsistencias().then(data => {
            data.forEach(x => {
                arrayAsistencias.push(x.uid); 
            });
        });

        turno = {
            fecha: fechaActual,
            horaEntrada: hora,
            asistencias: arrayAsistencias
        }

    } else {
        turno = {
            fecha: fechaActual,
            horaEntrada: hora,
        }
    }

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(turno),
        headers: {'Content-Type': 'application/json', 'x-token': getToken()}
    })
    .then(resp => resp.json())
    .then(data => {
        localStorage.setItem('idTurno', data.turno.uid);

        document.getElementById('btnIniciar').classList.remove('d-sm-inline-block');
        document.getElementById('btnTerminar').classList.add('d-sm-inline-block');
        turnoActivo = true;

        localStorage.setItem('turnoActivo', turnoActivo);
    })
    .catch(err => {
        console.log(err);
    });

    
});

btnTerminar.addEventListener('click', async() => {
    const fecha = new Date();
    const hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();

    const id = getId();

    const turno = {
        horaSalida: hora
    }

    fetch(`${url}${id}`, {
        method: 'PUT',
        body: JSON.stringify(turno),
        headers: {'Content-Type': 'application/json', 'x-token': getToken()}
    })
    .then(resp => resp.json())
    .then(({errors}) => {
        if (errors) {
            return console.error(errors);
        }

        window.location = 'index.html';
    })
    .catch(err => {
        console.log(err);
    });

    localStorage.removeItem('turnoActivo');
    localStorage.removeItem('idTurno');

    if (hora >= '22:00:00') {
        localStorage.removeItem('turnoPasado');
    } else {
        localStorage.setItem('turnoPasado', true);
    }    

    window.location = 'index.html';

    
});

const renderClientesVencidos = (data) => {
    data.forEach(x => {
        const html = `
            <td> <a href="/pages/clientes/cliente.html?id=${x.uid}">${x.nombre}</a> </td>
            <td> ${x.apellido} </td>
            <td> ${x.correo} </td>
            <td> ${x.telefono} </td>
            <td> ${x.fecha_pago} </td>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = html;

        tbodyClientesVencidos.append(tr);
    });
}

const main = async() => {
    await validarJWT();
    validarMensualidades().then(renderClientesVencidos);
}

main();