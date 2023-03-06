const url = 'http://localhost:8080/venta';
const url_num = 'http://localhost:8080/venta/numeroVenta';
const url_producto = 'http://localhost:8080/producto/';

const empleadoName = document.querySelector('#empleadoName');
const divProductos = document.getElementById('divProductos');
const listarProductos = document.getElementById('listarProductos');
const labelTotal = document.getElementById('labelTotal');

const getProductosStorage = () => {
    const array = localStorage.getItem('productos');

    const productos = JSON.parse(array);

    return productos;
}

const getRestar = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const restar = urlSearchParams.get("restar");

    return restar;
}

const getCortar = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const cortar = urlSearchParams.get("cortar");

    return cortar;
}

const getToken = () => {
    return localStorage.getItem('token') || '';
}

const getId = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");

    return id;
}

const getProductos = async() => {
    const token = getToken();

    const resp = await fetch(`${url_producto}?limite=100`, {
        headers: {'x-token': token}
    });

    const { productos } = await resp.json();

    return productos;
}

const getNumVenta = async() => {
    const token = getToken();

    const resp = await fetch(`${url_num}`, {
        headers: {'x-token': token}
    });

    const { max } = await resp.json();

    return max;
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

const renderProducto = (data) => {

        const html = `
        <label id="${data.uid}"><a href="carrito.html?id=${data.uid}&cortar=true"><i class="fas fa-trash-alt fa-sm fa-fw mr-2 text-danger"></i></a> ${data.Nombre}</label>
        <label> - $${data.Precio}</label>
        <label> - Cantidad: </label> <a href="carrito.html?id=${data.uid}&sumar=${data.Cantidad + 1}" class="btn btn-sm btn-outline-success">+1</a> ${data.Cantidad} <a href="carrito.html?id=${data.uid}&restar=${data.Cantidad - 1}" class="btn btn-sm btn-outline-success">-1</a>
        <label> - Subtotal: $${data.Subtotal}</label>
        `;

        const div = document.createElement('div');
        div.innerHTML = html;

        divProductos.append(div);
}

const renderProductos = (data) => {
    data.forEach(x => {
        const html = `
        <label id="${x.uid}"><a href="carrito.html?id=${x.uid}"><i class="fas fa-check-square fa-sm fa-fw mr-2 text-success"></i></a> ${x.nombre}</label>
        <label> - $${x.precio_venta}</label>
        `;

        const div = document.createElement('div');
        div.innerHTML = html;

        listarProductos.append(div);
    });
}

const updateCarrito = async() => {
    const id = getId();
    const token = getToken();
    const cortar = getCortar();
    const restar = getRestar();

    let active = localStorage.getItem('active') || false;
    let productos = localStorage.getItem('productos') || [];
    let total = 0;

    if (active) {
        document.getElementById('divTotal').classList.remove('d-none');
        document.getElementById('btnComprar').classList.remove('d-none');
        
        let encontro = false;
        let num = 0;

        let arr = JSON.parse(productos);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].uid == id) {
                encontro = true;
                num = i;
            }
        }

        if (encontro) {
            if (restar > 0) {
                arr[num].Cantidad = restar;
            } else {

                if (restar == 0) {
                    const res = arr.filter((arr) => arr.uid !== id);
                    arr = res;
                    
                    if (arr.length == 0) {
                        localStorage.removeItem('productos');
                        localStorage.removeItem('active');
    
                        window.location = 'carrito.html'
                    } else {
                        localStorage.setItem('productos', JSON.stringify(arr));

                        window.location = 'carrito.html'
                    }
                }

                if (cortar) {
                    const res = arr.filter((arr) => arr.uid !== id);
                    arr = res;
                    
                    if (arr.length == 0) {
                        localStorage.removeItem('productos');
                        localStorage.removeItem('active');
    
                        window.location = 'carrito.html'
                    } else {
                        localStorage.setItem('productos', JSON.stringify(arr));
                    }
                } else {
                    arr[num].Cantidad++;
                    arr[num].Subtotal = arr[num].Precio * arr[num].Cantidad;
                    localStorage.setItem('productos', JSON.stringify(arr));
                }
            }
            
        } else {    
            if (id) {
                const resp = await fetch(`${url_producto}${id}`, {
                    headers: {'x-token': token}
                });
    
                const { producto } = await resp.json();
    
                arr.push({'uid': producto.uid, 'Nombre': producto.nombre, 'Precio': producto.precio_venta, 'Cantidad': 1, 'Subtotal': producto.precio_venta});
                localStorage.setItem('productos', JSON.stringify(arr));

            }  
        }

        arr.forEach(x => {
            renderProducto(x);
            
            total = total + (x.Precio * x.Cantidad);

            labelTotal.innerText = `$${total}`;
        });

        

    } else {

        if (id) {
            const resp = await fetch(`${url_producto}${id}`, {
                headers: {'x-token': token}
            });

            const { producto } = await resp.json();

            const render = {'uid': producto.uid, 'Nombre': producto.nombre, 'Precio': producto.precio_venta, 'Cantidad': 1, 'Subtotal': producto.precio_venta};

            total = render.Precio;
            labelTotal.innerText = `$${total}`;

            renderProducto(render);
            
            productos.push(render);
            localStorage.setItem('productos', JSON.stringify(productos));

            active = true;
            localStorage.setItem('active', active);

            document.getElementById('divTotal').classList.remove('d-none');
            document.getElementById('btnComprar').classList.remove('d-none');
        }   
    }
}

formulario.addEventListener('submit', async(ev) => {
    ev.preventDefault();

    const productos = getProductosStorage();

    let numeroVenta = 0;
    let formData = {};

    let numero = await getNumVenta();
    numeroVenta = numero + 1;

    productos.forEach(x => {

        formData = {"numeroVenta": numeroVenta, "subtotal": x.Subtotal, "cantidad": x.Cantidad, "producto": x.uid};

        const token = getToken();

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

            localStorage.removeItem('productos');
            localStorage.removeItem('active');
        })
        .catch(err => {
            console.log(err);
        })
    });

    
});



const main = async() => {
    await validarJWT();
    getProductos().then(renderProductos);
    updateCarrito();
} 

main();