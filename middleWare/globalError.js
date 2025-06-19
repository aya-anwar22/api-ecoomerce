
const globalError = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === "development"){
        errorDevlopment(err, res)
    } else{
        errorProduction(err, res)
    }
    
}

const errorDevlopment = (err, res) =>{
    return res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
        stack : err.stack
    })
}




const errorProduction = (err, res) =>{
    return res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
    })
}
module.exports = globalError