const express = require('express');
const app = express();
require('dotenv').config()
const morgan = require('morgan')
const categoryRouter = require('./router/categoryRouter');
const authRouter = require('./router/authRouter')
const userRouter = require('./router/userRouter')
const brandRouter = require('./router/brandRouter')
const subCategoryRouter = require('./router/subCategoryRouter')
const productRouter = require('./router/productRouter')
const cartRouter = require('./router/cartRouter')
const orderRouter = require('./router/orderRouter')

const port = process.env.PORT;
const db = require('./config/db');
db()
const ApiError = require('./utils/apiError')
const globalError = require('./middleWare/globalError')
//middleWare 
app.use(express.json());


app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/brand', brandRouter);
app.use('/api/v1/sub-category', subCategoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);


app.all('*', (req, res, next) => {
    next(new ApiError(`this route ${req.originalUrl} not found` , 400))

})

//global error handling middleware
app.use(globalError)


if(process.env.NODE_ENV ==="development"){
    app.use(morgan('dev'))

}



const server = app.listen(port, ()=>{

    console.log(`server is running on port ${port}`)
})


process.on("unhandledRejection", (err) =>{
    console.log(`unhandledRejection Error : ${err.message}`);
    server.close(() =>{
        console.log('shuting');
        process.exit(1);
    })
})
