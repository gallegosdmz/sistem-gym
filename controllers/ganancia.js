const PDFDocument = require('pdfkit');
const { request, response } = require('express');
const { Venta, Gasto } = require('../models');

const { CurrentDate } = require('../helpers');

const generarReporteDiario = async(req = request, res = response) => {
    const doc = new PDFDocument();

    let acumVentas = 0;
    let acumGastos = 0;

    let gananciaDiaria = 0;

    let opIndv = 0;

    // Fecha actual
    const timeStamp = CurrentDate().toJSON();
    const date = timeStamp.slice(0, 10);

    const query = {estado: true, fecha: date};

    const [totalVentas, ventas] = await Promise.all([
       Venta.countDocuments(query),
       Venta.find(query).populate('producto', 'nombre').populate('mensualidad', 'tipo')
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

    gananciaDiaria = acumVentas - acumGastos;

    // Establece el encabezado de la respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporteDiario.pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Olimpo GYM', {align: 'center', lineGap: 3});
    doc.fontSize(16).text(`Reporte Diario: ${date}`, {align: 'center', wordSpacing: 2, lineGap: 7});
    doc.fontSize(16).text('Productos Vendidos:', {wordSpacing: 3, lineGap: 10});
    ventas.forEach(x => {
        if (x.producto) {
            doc.fontSize(16).text(`${x.producto.nombre} - Cantidad Vendida: ${x.cantidad}`, {wordSpacing: 3, lineGap: 5});
        }

        if (x.mensualidad) {
            doc.fontSize(16).text(`${x.mensualidad.tipo} - Cantidad Vendida: ${x.cantidad}`, {wordSpacing: 3, lineGap: 5});
        }
    });

    if (acumGastos > 0) {
        doc.fontSize(16).text('Gastos del Día: ', {wordSpacing: 3, lineGap: 10});

        gastos.forEach(x => {
            
        });
    }

    doc.end();
}

module.exports = {
    generarReporteDiario
}