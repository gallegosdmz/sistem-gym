const url = 'http://localhost:8080/cliente';
const url_contactos = 'http://localhost:8080/contacto';
const url_mensualidades = 'http://localhost:8080/mensualidad';

const empleadoName = document.querySelector('#empleadoName');

const formulario = document.querySelector('#formulario');

const mensualidadInput = document.querySelector('#mensualidadInput');
const contactoInput = document.querySelector('#contactoInput');

const passwordInput = document.getElementById('passwordInput');
const repetPasswordInput = document.getElementById('repetPasswordInput');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getContactos = async() => {
    const token = getToken();

    const resp = await fetch(`${url_contactos}?limite=100`, {
        headers: {'x-token': token}
    });

    const { contactos } = await resp.json();

    return contactos;
}

const getMensualidades = async() => {
    const token = getToken();

    const resp = await fetch(`${url_mensualidades}?limite=100`, {
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
        document.getElementById('navGanancias').remove();
        document.getElementById('navNominas').remove();
    }

    empleadoName.innerText = empleado.nombre;
}

const renderMensualidad = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = `${x.tipo} - ${x.precio}`

        mensualidadInput.append(option);
    });
}

const renderContactos = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = `${x.nombre} ${x.apellido} - ${x.telefono}`

        contactoInput.append(option);
    });
}

const validarFormulario = () => {
    let val = true;

    if (passwordInput.value < 6) {
        document.getElementById('errorPassword').classList.remove('d-none');

        val =  false;
    }

    if (passwordInput.value != repetPasswordInput.value) {
        document.getElementById('errorRepeatpassword').classList.remove('d-none');


        val = false;
    }

    if (!val) {
        return false;
    }

    return true;
}

const resetErrors = () => {
    document.getElementById('errorCorreo').classList.add('d-none');
    document.getElementById('errorPassword').classList.add('d-none');
    document.getElementById('errorRepeatpassword').classList.add('d-none');
    document.getElementById('errorFechanac').classList.add('d-none');
    document.getElementById('errorFechapago').classList.add('d-none');
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    resetErrors();

    const validacion = validarFormulario();

    if (validacion) {
        const token = getToken();

        for (let el of formulario.elements) {
            if (el.name.length > 0) {
                formData[el.name] = el.value;
            }
        }

        // Eliminar espacios en blanco de contraseña
        const contra = formData.password;
        formData.password = contra.split(" ").join("");

        fetch('http://localhost:8080/cliente', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json', 'x-token': token}
        })
        .then(resp => resp.json())
        .then(({errors}) => {
            if (errors) {
                console.log(errors);

                return errors.forEach(x => {
                    switch(x.param) {
                        case 'correo':
                            document.getElementById('errorCorreo').classList.remove('d-none');

                            break;

                        case 'password':
                            document.getElementById('errorPassword').classList.remove('d-none');

                            break;
                        
                        case 'fecha_nac':
                            document.getElementById('errorFechanac').classList.remove('d-none');

                            break;
                        
                        case 'fecha_pago':
                            document.getElementById('errorFechapago').classList.remove('d-none');

                            break;
                    }
                });
            }

            window.location = 'listar.html';
        })
        .catch(err => {
            console.log(err);
        })

    }
});

const main = async() => {
    await validarJWT();
    getMensualidades().then(renderMensualidad);
    getContactos().then(renderContactos);
}

main();