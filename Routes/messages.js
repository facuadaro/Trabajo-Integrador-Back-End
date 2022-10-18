const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { application } = require('express');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "usuarios"
});

router.post('/messages', async function (req, res, next) {
  try {
    console.log(req.body)
    let { idmessages, idusuario, asunto, mensajeTexto, usuarioDestino, createdAt, updatedAt } = req.body;
    const sql = `Insert Into messages (idmessages, idusuario, asunto, mensajeTexto, usuarioDestino, createdAt, updatedAt) VALUES ( ?, ?, ?, ?, ?, ?, ? )`
    con.query(
      sql, [idmessages, idusuario, asunto, mensajeTexto, usuarioDestino, createdAt, updatedAt],
      (err, result, fields) => {
        if (err) {
          res.send({ status: 0, data: err });
        } else {
          let token = jwt.sign({ data: result }, 'secret')
          res.send({ status: 1, data: result, token: token });
        }
      })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});


app.get('/listamessages', async function (req, res, next) {
  try {
    let { idusuario, usuarioDestino, createdAt, mensajeTexto } = req.body; 
    // const sql = `Select mensaje, d.name from messages m left join user  d on d.id = m.iddest Where m.idorigen = "id del usuario logueado"`
    const sql = `SELECT * FROM messages WHERE idusuario = ? AND usuarioDestino =? AND createdAt = ? AND mensajeTexto = ?` 

    con.query(
      sql, [idusuario, usuarioDestino, createdAt, mensajeTexto],
    function(err, result, fields){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        let token = jwt.sign({ data: result }, 'secret')
        res.send({ status: 1, data: result, token: token });
      }
      
    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
module.exports = router;