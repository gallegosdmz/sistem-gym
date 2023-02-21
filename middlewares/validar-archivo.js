const { request ,response } = require("express")

const validarArchivoSubir = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        
        console.log(req.files);

        return res.status(400).json({msg: 'No hay archivos que subir - archivo'});
    }

    next();

}

module.exports = {
    validarArchivoSubir
}