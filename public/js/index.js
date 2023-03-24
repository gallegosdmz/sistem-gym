const url = 'http://localhost:8080/turno/';
const url_asistencia = 'http://localhost:8080/asistencia/';

const empleadoName = document.querySelector('#empleadoName');
const btnIniciar = document.getElementById('btnIniciar');
const btnTerminar = document.getElementById('btnTerminar');

const getId = () => {
    const id = localStorage.getItem('idTurno');

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
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

btnIniciar.addEventListener('click', () => {
    const fecha = new Date();
    /* const hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds(); */

    const hora = '06:00:00';

    let turnoActivo = false;

    const fechaActual = fecha.toISOString().slice(0, 10);

    if (hora >= '06:00:00' && hora <= '12:00:00') {
        const turno = {
            fecha: fechaActual,
            horaEntrada: hora,
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(turno),
            headers: {'Content-Type': 'application/json', 'x-token': getToken()}
        })
        .then(resp => resp.json())
        .then(data => {
            localStorage.setItem('idTurno', data.turno.uid);
        })
        .then(({errors}) => {
            if (errors) {
                return console.error(errors);
            }

            document.getElementById('btnIniciar').classList.remove('d-sm-inline-block');
            document.getElementById('btnTerminar').classList.add('d-sm-inline-block');
            turnoActivo = true;

            localStorage.setItem('turnoActivo', turnoActivo);
        })
        .catch(err => {
            console.log(err);
        })

    } else {
        console.log('Tarde');

        console.log(hora);

        console.log(fecha.toISOString().slice(0, 10));
    }
    
});

btnTerminar.addEventListener('click', async() => {
    const fecha = new Date();
    const hora = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();

    const id = getId();

    let formData = new FormData();
    formData.append('horaSalida', hora);

    fetch(`${url}${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'x-token': getToken()},
        body: formData
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

    console.log(hora);

    localStorage.removeItem('turnoActivo');

    if (hora >= '22:00:00') {
        localStorage.removeItem('turnoPasado');
    } else {
        localStorage.getItem('turnoPasado', true);
    }    

    window.location = 'index.html';

    
});

const main = async() => {
    await validarJWT();
}

main();