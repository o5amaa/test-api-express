const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mariadb = require("mariadb");

// Prams
var port = 3332;

// Your MariaDB connection pool setup code
const pool = mariadb.createPool({
  port: 3330,
  host: "localhost",
  user: "root",
  password: "example",
  database: "testDB",
  connectionLimit: 5,
});

// Socket.io event handlers
// io.on("connection", (socket) => {
//   console.log("A user connected.");

//   socket.on("chat message", (message) => {
//     pool
//       .getConnection()
//       .then((conn) => {
//         conn
//           .query("INSERT INTO messages (content) VALUES (?)", [message])
//           .then(() => {
//             conn.release();
//             io.emit("chat message", message);
//           })
//           .catch((err) => {
//             conn.release();
//             console.error("Error executing query:", err);
//           });
//       })
//       .catch((err) => {
//         console.error("Error getting connection from pool:", err);
//       });
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected.");
//   });
// });

app.get("/", (_, res) => {
  try {
    pool
      .getConnection()
      .then((conn) => {
        // conn.query('INSERT INTO messages (content) VALUES (?)', [message])
        conn.query(`SELECT * FROM testTb`)
          .then((data) => {
            conn.release();
            res.status(200).json({
              status: res.statusCode.toString(),
              msg: "geter",
              data: data,
            });
          })
          // *
          .catch((ex) => {
            res.status(400).json({
              status: res.statusCode.toString(),
              statusMessage: `${res.statusMessage}`,
              type: "Cach:conn",
              msg: ex,
            });
          });
      })
      //* 
      .catch((err) => {
        console.error("Error getting connection from pool:", err);
        res.status(400).json({
          status: res.statusCode.toString(),
          statusMessage: `${res.statusMessage}`,
          type: "Cach:conn:Error getting connection from pool ",
          msg: err,
        });
        //* 
      });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode.toString(),
      statusMessage: `${res.statusMessage}`,
      type: "Cach",
      msg: error,
    });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
