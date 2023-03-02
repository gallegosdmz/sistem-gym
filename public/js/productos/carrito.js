const url = 'http://localhost:8080/venta';
const url_num = 'http://localhost:8080/venta/numeroVenta';
const url_producto = 'http://localhost:8080/producto/';

const empleadoName = document.querySelector('#empleadoName');

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
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

const updateCarrito = async() => {
    const id = getId();
    const token = getToken();

    let active = localStorage.getItem('active') || false;
    let productos = localStorage.getItem('productos') || [];

    if (active) {
        let encontro = false;
        let num = 0;

        let arr = JSON.parse(productos);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                encontro = true;
                num = i;
            }
        }

        if (encontro) {
            arr[num].Cantidad = arr[num].Cantidad + 1;
            localStorage.setItem('productos', JSON.stringify(arr));
        } else {
            const resp = await fetch(`${url_producto}${id}`, {
                headers: {'x-token': token}
            });

            const { producto } = await resp.json();

            arr.push({'id': producto.uid, 'Nombre': producto.nombre, 'Precio': producto.precio_venta, 'Cantidad': 1});
            localStorage.setItem('productos', JSON.stringify(arr));
        }

    } else {

        if (id) {
            const resp = await fetch(`${url_producto}${id}`, {
                headers: {'x-token': token}
            });

            const { producto } = await resp.json();

            console.log(`Nombre: ${producto.nombre}`);
            console.log(`Precio: ${producto.precio_venta}`);
            
            productos.push({'id': producto.uid, 'Nombre': producto.nombre, 'Precio': producto.precio_venta, 'Cantidad': 1});
            localStorage.setItem('productos', JSON.stringify(productos));

            active = true;
            localStorage.setItem('active', active);
        }
    }
}

/* formulario.addEventListener('submit', ev => {
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
    .then(({errors}) => {
        if (errors) {
            console.log(errors);
        }

        window.location = 'listar.html';
    })
    .catch(err => {
        console.log(err);
    })

}); */

const main = async() => {
    await validarJWT();
    await updateCarrito();
} 

main();