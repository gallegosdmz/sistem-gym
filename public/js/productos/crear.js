const url = 'http://localhost:8080/producto/';
const url_categoria = 'http://localhost:8080/categoria/';
const url_proveedor = 'http://localhost:8080/proveedor/';
const url_upload = 'http://localhost:8080/upload/productos/'

const empleadoName = document.querySelector('#empleadoName');
const formulario = document.querySelector('#formulario');

const categoriaInput = document.getElementById('categoriaInput');
const proveedorInput = document.getElementById('proveedorInput');

const imgInput = document.getElementById('imgInput');

const modal = document.getElementById("ventanaModal");
const span = document.getElementsByClassName("cerrar")[0];
const confAgregar = document.querySelector('#confAgregar');
const confSalir = document.querySelector('#confSalir');

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getCategorias = async() => {
    const token = getToken();

    const resp = await fetch(`${url_categoria}?limite=100`, {
        headers: {'x-token': token}
    });

    const { categorias } = await resp.json();

    return categorias;
}

const getProveedores = async() => {
    const token = getToken();

    const resp = await fetch(`${url_proveedor}?limite=100`, {
        headers: {'x-token': token}
    });

    const { proveedores } = await resp.json();

    return proveedores;
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



/* const validarFormulario = () => {
    let val = true;

    const archivoRuta = imgInput.value;
    const extPermitidas = /(.jpg|.PNG|.jpeg)$/i;

    if (!extPermitidas.exec(archivoRuta)) {
        document.getElementById('errorImg').classList.remove('d-none');

        val = false;
    }

    if (!val) {
        return false;
    }

    return true;
}

const resetErrors = () => {
    document.getElementById('errorPassword').classList.add('d-none');
} */

const renderCategorias = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = x.nombre;

        categoriaInput.append(option);
    });
}

const renderProveedores = (data) => {
    data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.uid;
        option.text = `${x.nombre} - ${x.telefono}`;

        proveedorInput.append(option);
    });
}

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    const token = getToken();

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'x-token': token}
    })
    .then(resp => resp.json())
    .then(data => {
        modal.style.display = "block";

        confAgregar.addEventListener('click', () => {
            const id = data.producto.uid;

            let formData = new FormData();
            formData.append("archivo", imgInput.files[0])

            fetch(`${url_upload}${id}`, {
                method: 'PUT',
                body: formData,
            })
            .then(resp => resp.json())
            .then(({errors}) => {
                if (errors) {
                    return console.error(errors);
                }

                window.location = 'listar.html';
            })
            .catch(err => {
                console.log(err);
            })
        });
    })
    .then(({errors}) => {
        if (errors) {
            return console.log(errors);
        }
    })
    .catch(err => {
        console.log(err);
    })

});

const main = async() => {
    await validarJWT();
    getCategorias().then(renderCategorias);
    getProveedores().then(renderProveedores);
}

main();