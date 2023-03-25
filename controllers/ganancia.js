const { request, response } = require('express');
const { Venta, Gasto } = require('../models');

const { CurrentDate } = require('../helpers');

const generarReporteDiario = async(req = request, res = response) => {
    let acumVentas = 0;
    let acumGastos = 0;

    let opIndv = 0;

    // Fecha actual
    const timeStamp = CurrentDate().toJSON();
    const date = timeStamp.slice(0, 10);

    const query = {estado: true, fecha: date};

    const [totalVentas, ventas] = await Promise.all([
       Venta.countDocuments(query),
       Venta.find(query) 
    ]);

    const [totalGastos, gastos] = await Promise.all([
        Gasto.countDocuments(query),
        Gasto.find(query)
    ]);

    ventas.forEach(x => {
        acumVentas = acumVentas + x.subtotal;
    });

    gastos.forEach(x => {
        if (x.individual) {
            opIndv = x.precio * x.stock

            acumGastos = acumGastos + opIndv;
        } else {
            acumGastos = acumGastos + x.precio;
        }
    });
}

module.exports = {
    generarReporteDiario
}