const { request, response } = require('express');
const { Venta, Gasto } = require('../models');

const { CurrentDate } = require('../helpers');

const generarReporteDiario = async(req = request, res = response) => {
    let acumVentas = 0;

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
        
    });
}

module.exports = {
    generarReporteDiario
}