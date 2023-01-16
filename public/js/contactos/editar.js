const url = 'http://localhost:8080/contacto/'

const empleadoName = document.querySelector('#empleadoName');

const formulario = document.querySelector('#formulario');

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getContacto = async() => {
    const token = localStorage.getItem('token') || '';
    const id = getId();

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { contacto } = await resp.json();

    return contacto;
}

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

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

const renderData = (contacto) => {
    document.getElementById('nombreInput').value = contacto.nombre;
    document.getElementById('apellidoInput').value = contacto.apellido;
    document.getElementById('telefonoInput').value = contacto.telefono;
    document.getElementById('parentescoInput').value = contacto.parentesco;
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const id = getId();

    const token = localStorage.getItem('token') || '';

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(`${url}${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(({errors}) => {
        if (errors) {
            return errors.forEach(x => {
                switch(x.param) {
                    case 'nombre':
                        document.getElementById('errorNombre').classList.remove('d-none');

                        break;

                    case 'apellido':
                        document.getElementById('errorApellido').classList.remove('d-none');

                        break;
                    
                    case 'telefono':
                        document.getElementById('errorTelefono').classList.remove('d-none');

                        break;
                    
                    case 'parentesco':
                        document.getElementById('errorParentesco').classList.remove('d-none');

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
    getContacto().then(renderData);
}

main();