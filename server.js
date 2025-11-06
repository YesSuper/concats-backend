// 引入所需模块
require('dotenv').config();  // 读取 .env 文件
const mysql = require('mysql');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

// 解析 JSON 请求体
app.use(express.json());
app.use(cors());  // 解决跨域问题

// 配置 MySQL 数据库连接
const connection = mysql.createConnection({
    host: process.env.DB_HOST,  // 从环境变量中读取 host
    user: process.env.DB_USER,  // 从环境变量中读取 user
    password: process.env.DB_PASS,  // 从环境变量中读取 password
    database: process.env.DB_NAME  // 从环境变量中读取 database
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// 处理添加联系人请求
app.post('/add-contact', (req, res) => {
    const { name, phone } = req.body;  // 获取前端提交的数据
    // 将数据插入到 contacts 表中
    connection.query('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone], (err, results) => {
        if (err) {
            res.status(500).send('Error adding contact');
            return;
        }
        res.send('Contact added successfully');
    });
});

// 处理修改联系人请求
app.put('/update-contact/:id', (req, res) => {
    const { name, phone } = req.body;
    const { id } = req.params;

    connection.query('UPDATE contacts SET name = ?, phone = ? WHERE id = ?', [name, phone, id], (err, results) => {
        if (err) {
            res.status(500).send('Error updating contact');
            return;
        }
        res.send('Contact updated successfully');
    });
});

// 处理删除联系人请求
app.delete('/delete-contact/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM contacts WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send('Error deleting contact');
            return;
        }
        res.send('Contact deleted successfully');
    });
});

// 处理获取联系人列表请求
app.get('/get-contacts', (req, res) => {
    connection.query('SELECT * FROM contacts', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching contacts');
            return;
        }
        res.json(results);  // 返回联系人数据
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
