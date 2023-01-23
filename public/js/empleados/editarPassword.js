const url = 'http://localhost:8080/empleado/password/';
const empleadoName = document.querySelector('#empleadoName');

const newPasswordInput = document.getElementById('newPasswordInput');
const passwordInput = document.getElementById('passwordInput');
const repetPasswordInput = document.getElementById('repetPasswordInput');

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
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

const validarFormulario = () => {
    let val = true;

    if (passwordInput.value < 6) {
        document.getElementById('errorPassword').classList.remove('d-none');

        val =  false;
    }

    if (newPasswordInput.value < 6) {
        document.getElementById('errorPassword').classList.remove('d-none');

        val =  false;
    }


    if (newPasswordInput.value != repetPasswordInput.value) {
        document.getElementById('errorRepeatpassword').classList.remove('d-none');


        val = false;
    }

    if (!val) {
        return false;
    }

    return true;
}

const resetErrors = () => {
    document.getElementById('errornewPassword').classList.add('d-none');
    document.getElementById('errorPassword').classList.add('d-none');
    document.getElementById('errorRepeatpassword').classList.add('d-none');
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const id = getId();

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

        fetch(`${url}${id}`, {
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
                        case 'newPassword':
                            document.getElementById('errornewPassword').classList.remove('d-none');

                            break;

                        case 'password':
                            document.getElementById('errorPassword').classList.remove('d-none');

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
}

main();