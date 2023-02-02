const { Empleado, Contacto, Role, Cliente, Mensualidad, Nomina, Servicio, Categoria, Proveedor, Producto, Gasto } = require('../models');

// Helpers ROLES
const esRoleValido = async(rol = '') => {
  
    const existeRol = await Role.findOne({rol});

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

// Helpers EMPLEADO
const emailExisteEmpleado = async(correo = '') => {
    const existeEmail = await Empleado.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo}, ya está registrado`);
    }
}

const empleadoExiste = async(id) => {
    const empleado = await Empleado.findById(id);

    if (!empleado) {
        throw new Error(`El empleado ${id}, no existe`);
    }

    if (!empleado.estado) {
        throw new Error(`El empleado ${id}, está eliminado de la BD`);
    }
}

const curpExiste = async(curp = '') => {
    const existeCurp = await Empleado.findOne({curp});

    if (existeCurp) {
        throw new Error(`El CURP ${curp}, ya está registrado`);
    }
}

const rfcExiste = async(rfc = '') => {
    const existeRfc = await Empleado.findOne({rfc});

    if (existeRfc) {
        throw new Error(`El RFC ${rfc}, ya está registrado`);
    }
}

// Helperes CONTACTO
const contactoExiste = async(id) => {
    const existeContacto = await Contacto.findById(id);

    if (!existeContacto) {
        throw new Error(`El contacto ${id}, no existe`);
    }

    if (!existeContacto.estado) {
        throw new Error(`El contacto ${id}, está eliminado de la BD`);
    }
}

// Helpers CLIENTE
const clienteExiste = async(id) => {
    const existeCliente = await Cliente.findById(id);

    if (!existeCliente) {
        throw new Error(`El cliente ${id}, no existe`);
    }

    if (!existeCliente.estado) {
        throw new Error(`El cliente ${id}, está eliminado de la BD`);
    }
}

const emailExisteCliente = async(correo = '') => {
    const existeEmail = await Cliente.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo}, ya está registrado`);
    }
}

// Helpers MENSUALIDADES
const mensualidadExiste = async(id) => {
    const existeMensualidad = await Mensualidad.findById(id);

    if (!existeMensualidad) {
        throw new Error(`La mensualidad ${id}, no existe`);
    }

    if (!existeMensualidad.estado) {
        throw new Error(`La mensualidad ${id}, está eliminada de la BD`);
    }
}

// Helpers NOMINAS
const nominaExiste = async(id) => {
    const existeNomina = await Nomina.findById(id);

    if (!existeNomina) {
        throw new Error(`La nomina ${id}, no existe`);
    }

    if (!existeNomina.estado) {
        throw new Error(`La nomina ${id}, está eliminada de la BD`);
    }
}

const nominaPagada = async(id) => {
    const nomina = await Nomina.findById(id);

    if (nomina.pagada) {
        throw new Error(`La nomina ${id}, ya está pagada`);
    }
}

// Helpers SERVICIOS
const servicioExiste = async(id) => {
    const existeServicio = await Servicio.findById(id);

    if (!existeServicio) {
        throw new Error(`El servicio ${id}, no existe`);
    }

    if (!existeServicio.estado) {
        throw new Error(`El servicio ${id}, está eliminado de la BD`);
    }
}

// Helpers CATEGORIAS
const categoriaExiste = async(id) => {
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`La categoria ${id}, no existe`);
    }

    if (!existeCategoria.estado) {
        throw new Error(`La categoria ${id}, está eliminada de la BD`);
    }
}

// Helpers PROVEEDORES
const proveedorExiste = async(id) => {
    const existeProveedor = await Proveedor.findById(id);

    if (!existeProveedor) {
        throw new Error(`El proveedor ${id}, no existe`);
    }

    if (!existeProveedor.estado) {
        throw new Error(`El proveedor ${id}, está eliminado de la BD`);
    }
}

// Helpers PRODUCTOS
const productoExiste = async(id) => {
    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El producto ${id}, no existe`);
    }
    
    if (!existeProducto.estado) {
        throw new Error(`El producto ${id}, está eliminado de la BD`);
    }
}

// Helpers GASTOS
const gastoExiste = async(id) => {
    const existeGasto = await Gasto.findById(id);

    if (!existeGasto) {
        throw new Error(`El gasto ${id}, no existe`);
    }

    if (!existeGasto.estado) {
        throw new Error(`El gasto ${id}, está eliminado de la BD`);
    }
}

module.exports = {
    esRoleValido,
    emailExisteEmpleado,
    curpExiste,
    rfcExiste,
    contactoExiste,
    empleadoExiste,
    clienteExiste,
    emailExisteCliente,
    mensualidadExiste,
    nominaExiste,
    nominaPagada,
    servicioExiste,
    categoriaExiste,
    proveedorExiste,
    productoExiste,
    gastoExiste
}