const express=require('express');
const pasth=require('path');
const bcrypt=require('bcrypt');
const collection=require('./config');
const Student = require('./student')
const rout = require('./studentRouter'); // Необходимо убедиться, что это правильный путь к файлу


const app=express();

//json
app.use(express.json());

app.use(express.urlencoded({extended:false}));


//Использование EJS
app.set('view engine','ejs')
//Статические файлы
app.use(express.static("public"));
app.use('/students', rout); // Подключаем роутер с префиксом '/students'

app.get("/", (req,res)=>{
    res.render("login");
})

app.get("/signup", (req,res)=>{
    res.render("signup")
})

app.post("/students/add", async (req, res) => {
    try {
        const { fullName, course, group, status, address } = req.body;

        // Создаем нового студента
        const student = new Student({
            fullName,
            course,
            group,
            status,
            address
        });

        // Сохраняем студента в базе данных
        const newStudent = await student.save();

        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Изменение данных студента
app.post("/students/update", async (req, res) => {
    try {
        const { studentId, fullNameUpdate, courseUpdate, groupUpdate, statusUpdate, addressUpdate } = req.body;

        // Ищем студента по ID и обновляем его данные
        const updatedStudent = await Student.findByIdAndUpdate(studentId, {
            fullName: fullNameUpdate,
            course: courseUpdate,
            group: groupUpdate,
            status: statusUpdate,
            address: addressUpdate
        }, { new: true });

        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Удаление студента
app.post("/students/delete", async (req, res) => {
    try {
        const { studentId } = req.body;

        // Удаляем студента по ID
        await Student.findByIdAndRemove(studentId);

        res.json({ message: 'Студент удален' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Регистрация

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    //проверка на регистрацию
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.send("Пользователь уже существует, пожалуйста, выберите другое имя");
    } else {
        //hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;
        await collection.insertMany(data); // Используйте insertOne вместо insertMany для добавления одного документа
        console.log("Пользователь успешно зарегистрирован");

        // После успешной регистрации перенаправляем пользователя на главную страницу
        return res.redirect("/");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("Имя пользователя не найдено");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            return res.render("home");
        } else {
            return res.send("Неправильный пароль");
        }
    } catch (error) {
        console.error(error);
        return res.send("Произошла ошибка при входе");
    }
});

const port=5000;

app.listen(port,()=>{
    console.log(`Сервер запущен по порту ${port} `)
})
