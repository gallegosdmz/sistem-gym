const empleadoName = document.querySelector('#empleadoName');

const empleadoInput = document.getElementById('empleadoInput');

const btnCalcular = document.getElementById('btnCalcular');
const formulario = document.querySelector('#formulario');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getEmpleados = async() => {
    const token = getToken();

    const resp = await fetch('http://localhost:8080/empleado?limite=100', {
        headers: {'x-token': token}
    });

    const { empleados } = await resp.json();

    return empleados;
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

const renderEmpleados = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = `${x.nombre} ${x.apellido} - ${x.telefono}`;

        empleadoInput.append(option);
    });
}

btnCalcular.addEventListener('click', () => {
    // Calcular SUELDO BRUTO
    const total_horas = parseInt(document.getElementById('horasextraInput').value || 0) * parseInt(document.getElementById('preciohorasInput').value || 0);
    document.getElementById('totalhorasInput').value = total_horas;

    const total_asignaciones = parseInt(document.getElementById('bonotransporteInput').value || 0) + total_horas;
    document.getElementById('totalasignacionesInput').value = total_asignaciones;

    const sueldo_bruto = parseInt(document.getElementById('sueldobaseInput').value) + total_asignaciones - parseInt(document.getElementById('adelantosueldoInput').value || 0);
    document.getElementById('sueldobrutoInput').value = sueldo_bruto;

    // Calcular ISR
    const isr_marginal = (sueldo_bruto - 148.41) * 0.064;
    const isr = isr_marginal + 2.87 + 6.40;
    document.getElementById('isrInput').value = isr;

    document.getElementById('sueldonetoInput').value = sueldo_bruto - isr;
});

const resetErrors = () => {
    document.getElementById('errorSueldobase').classList.add('d-none');
    document.getElementById('errorHoras').classList.add('d-none');
    document.getElementById('errorPrecioHoras').classList.add('d-none');
    document.getElementById('errorBono').classList.add('d-none');
    document.getElementById('errorAdelanto').classList.add('d-none');
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    resetErrors();

    const token = getToken();

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8080/nomina', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(({errors}) => {
        if (errors) {
            return errors.forEach(x => {
                switch(x.param) {
                    case 'sueldo_base':
                        document.getElementById('errorSueldobase').classList.remove('d-none');

                        break;

                    case 'horas_extra':
                        document.getElementById('errorHoras').classList.remove('d-none');

                        break;
                    
                    case 'precio_horas':
                        document.getElementById('errorPrecioHoras').classList.remove('d-none');

                        break;
                    
                    case 'bono_transporte':
                        document.getElementById('errorBono').classList.remove('d-none');

                        break;

                    case 'adelanto_sueldo':
                        document.getElementById('errorAdelanto').classList.remove('d-none');

                        break;
                }
            });
        }

        window.location = 'listar.html';
    })
    .catch(err => {
        console.log(err);
    })
});


const main = async() => {
    await validarJWT();
    getEmpleados().then(renderEmpleados);
}

main();