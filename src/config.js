    const mongoose= require('mongoose');
    const connect=mongoose.connect("mongodb://127.0.0.1:27017/Login-tut");

    //Првоерка на подключение

    connect.then(() => {
        console.log("База данных подключена!")
    }).catch((error) => {
        console.error("Ошибка при подключении к базе данных:", error);
    })

    const LoginSchema=new mongoose.Schema({
        name:{
            type: String,
            required: true,

        },
        password:{
            type: String,
            required:true,

        }
    })

    const collection= new mongoose.model("users", LoginSchema);

    module.exports=collection;