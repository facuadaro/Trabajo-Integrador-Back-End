const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "usuarios"
});

router.post('/register', async function (req, res, next) {
  try {
    const agregarUsuario = (nombre, apellido, nombreUsuario, password) => {
      let query = "INSERT INTO users (nombre, apellido, nombreUsuario, password) VALUES (NULL, "+nombre+", "+apellido+", "+nombreUsuario+", "+password+")"
      con.query(query, function (err, result, filed) {
        if(err) throw err;
        console.log(result);
      })  
      }
    console.log(req.body)
    let { nombre, apellido, username, password, pais, ciudad } = req.body;

    const hashed_password = md5(password.toString())
    const checkUsername = `Select username FROM users WHERE username = ?`;
    con.query(checkUsername, [username], (err, result, fields) => {
      console.log(err, result)      
      if (result.lenght > 0) {
        const sql = `INSERT INTO users (nombre, apellido, username, password, pais, ciudad) VALUES ( ?, ?, ?, ?, ?, ? )`
        con.query(
          sql, [nombre, apellido, username, hashed_password, pais, ciudad],
          (err, result, fields) => {
            if (err) {
              res.send({ status: 0, data: err }); 
            } else {
              let token = jwt.sign({ data: result }, 'secret')
              res.send({ status: 1, data: result, token: token });
            }
          })
      }
    });


  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let { username, password } = req.body;

    const hashed_password = md5(password.toString())
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    con.query(
      sql, [username, hashed_password],
      function (err, result, fields) {
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


module.exports = router;