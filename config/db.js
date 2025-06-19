const mongoose = require('mongoose');

const dbConnect = () =>{
    mongoose.connect(process.env.DB_URI)
    .then((conn) =>{
        console.log(`DataBase connected ${conn.connection.host}`)
    })
    
    // .catch((err)=>{
    //     console.log(err);
    //     process.exit(1)
    // })
}


module.exports = dbConnect;