const url = 'http://localhost:8080/producto/';
const empleadoName = document.querySelector('#empleadoName');

const idP = document.getElementById('idP');
const nombreP = document.getElementById('nombreP');
const precioVentaP = document.getElementById('precioVentaP');
const precioCompraP = document.getElementById('precioCompraP'); 
const stockP = document.getElementById('stockP');
const disponibleP = document.getElementById('disponibleP');
const categoriaP = document.getElementById('categoriaP');
const proveedorP = document.getElementById('proveedorP');

const btnEditar = document.querySelector('#btnEditar');
const btnBorrar = document.querySelector('#btnBorrar');
const modal = document.getElementById("ventanaModal");
const span = document.getElementsByClassName("cerrar")[0];
const confEliminar = document.querySelector('#confEliminar');
const confSalir = document.querySelector('#confSalir');

const modal_id = document.getElementById('ventanaModalId');

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const errorSearchId = () => {
    modal_id.style.display = "block";

    confBuscar.addEventListener('click', () => {
        const id = document.getElementById('inputModal').value;
        
        window.location = `producto.html?id=${id}`;
    });

    confCancelar.addEventListener('click', () => {
        window.location = 'listar.html';
    });
}

const getProducto = async() => {
    const token = getToken();
    const id = getId();

    if (!id) {
        window.location = 'listar.html';
    }

    const resp = await fetch(`${url}${id}`, {
        headers: {'x-token': token}
    });

    const { producto } = await resp.json();

    return producto;
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
    }

    empleadoName.innerText = empleado.nombre;
}

const renderProducto = (producto) => {
    let disponible = 'No';

    if (!producto) {
        errorSearchId();
    }

    if (producto.disponible) {
        disponible = 'Si';
    }

    idP.innerText = producto.uid;
    nombreP.innerText = producto.nombre;
    precioVentaP.innerText = producto.precio_venta;
    precioCompraP.innerText = producto.precio_compra;
    stockP.innerText = producto.stock;
    disponibleP.innerText = disponible;
    categoriaP.innerText = producto.categoria.nombre;
    proveedorP.innerText = producto.proveedor.nombre;
}

btnEditar.addEventListener('click', () => {
    const id = getId();

    window.location = `editar.html?id=${id}`;
});

btnBorrar.addEventListener('click', () => {
    modal.style.display = "block";

});

span.addEventListener('click', () => {
    modal.style.display = "none";
});

confEliminar.addEventListener('click', () => {
    const token = getToken();

    const id = getId();

    fetch(`${url}${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', 'x-token': token}
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

confSalir.addEventListener('click', () => {
    modal.style.display = "none";
});

const main = async() => {
    await validarJWT();
    getProducto().then(renderProducto);
}

main();