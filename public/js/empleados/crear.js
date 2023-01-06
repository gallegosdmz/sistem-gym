const contactoInput = document.querySelector('#contactoInput');
const empleadoName = document.querySelector('#empleadoName');

const passwordInput = document.getElementById('passwordInput');
const repetPasswordInput = document.getElementById('repetPasswordInput');

const formulario = document.querySelector('#formulario');

const getContactos = async() => {
    const token = localStorage.getItem('token') || '';

    const resp = await fetch('http://localhost:8080/contacto', {
        headers: {'x-token': token}
    });

    const { contactos } = await resp.json();

    return contactos;
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

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

const renderOptions = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = `${x.nombre} ${x.apellido} - ${x.telefono}`;

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
    document.getElementById('errorCurp').classList.add('d-none');
    document.getElementById('errorRfc').classList.add('d-none');
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    resetErrors();

    const validacion = validarFormulario();

    if (validacion) {
        const token = localStorage.getItem('token') || '';

        for (let el of formulario.elements) {
            if (el.name.length > 0) {
                formData[el.name] = el.value;
            }
        }

        // Eliminar espacios en blanco de contraseña
        const contra = formData.password;
        formData.password = contra.split(" ").join("");

        fetch('http://localhost:8080/empleado', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json', 'x-token': token}
        })
        .then(resp => resp.json())
        .then(({errors}) => {
            if (errors) {
                return errors.forEach(x => {
                    switch(x.param) {
                        case 'correo':
                            document.getElementById('errorCorreo').classList.remove('d-none');

                            break;

                        case 'password':
                            document.getElementById('errorPassword').classList.remove('d-none');

                            break;
                        
                        case 'curp':
                            document.getElementById('errorCurp').classList.remove('d-none');

                            break;
                        
                        case 'rfc':
                            document.getElementById('errorRfc').classList.remove('d-none');

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
    getContactos().then(renderOptions);
}

main();