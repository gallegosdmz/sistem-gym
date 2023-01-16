const url = 'http://localhost:8080/empleado';
const empleadoName = document.querySelector('#empleadoName');

const passwordInput = document.getElementById('passwordInput');
const repetPasswordInput = document.getElementById('repetPasswordInput');

let nombreInput = document.getElementById('nombreInput');

const formulario = document.querySelector('#formulario');

const getContactos = async() => {
    const token = localStorage.getItem('token') || '';

    const resp = await fetch('http://localhost:8080/contacto', {
        headers: {'x-token': token}
    });

    const { contactos } = await resp.json();

    return contactos;
}

const getEmpleado = async() => {
    const token = localStorage.getItem('token') || '';

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}/${id}`, {
        headers: {'x-token': token}
    });

    const { empleado } = await resp.json();

    return empleado;
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

const renderData = (empleado) => {

    const date = empleado.fecha_nac.slice(0, 10);
    
    document.getElementById('nombreInput').value = empleado.nombre;
    document.getElementById('apellidoInput').value = empleado.apellido;
    document.getElementById('correoInput').value = empleado.correo;
    document.getElementById('passwordInput').value = empleado.password;
    document.getElementById('curpInput').value = empleado.curp;
    document.getElementById('rfcInput').value = empleado.rfc;
    document.getElementById('numseguroInput').value = empleado.num_seguro;
    document.getElementById('lugarnacimientoInput').value = empleado.lugar_nacimiento;
    document.getElementById('fechanacInput').value = date;
    document.getElementById('telefonoInput').value = empleado.telefono;
    document.getElementById('direccionInput').value = empleado.direccion;
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

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

        fetch(`${url}/${id}`, {
            method: 'PUT',
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
    await validarJWT()
    getEmpleado().then(renderData);
    getContactos().then(renderOptions);
}

main();