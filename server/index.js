const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mariadb = require("mariadb");

// إعداد اتصال MySQL
// Your MariaDB connection pool setup code
const pool = mariadb.createPool({
  port: 3330,
  host: "localhost",
  user: "root",
  password: "example",
  database: "testDB",
  connectionLimit: 5,
});

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to MySQL database');
// });

// إعداد خادم Socket.io
// const server = http.createServer();
// const io = socketIO(server);

const pooll = async () => {
  conn = await pool.getConnection();
  sql = "Select * From messages";
  await conn
    .query(sql)
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((er) => {
      console.log(er);
      return er;
    });
};

let conn;

io.on("connection", async (socket) => {
  console.log("New client connected");
  var ll = pooll();

  socket.emit("List", ll);

  socket.on("message", async (data) => {
    console.log("Received message:", data);

    if (data == null || data == "") {
      console.log("NULL");
      return;
    }

    // قم بحفظ الرسالة في قاعدة البيانات MySQL
    const { sender, receiver, message } = data;
    conn = await pool.getConnection();
    sql = "INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)";
    await conn.query(sql, [`sender`, `receiver`, `${data}`]);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

var x = [];
x.length;

//
// app.get("/", (req, res) => {
//   try {
//     pool
//       .getConnection()
//       .then((conn) => {
//         // conn.query('INSERT INTO messages (content) VALUES (?)', [message])
//         conn
//           .query(`SELECT * FROM messages`)
//           .then((data) => {
//             conn.release();
//             res.status(200).json({
//               status: res.statusCode.toString(),
//               msg: "geter",
//               data: data.length < 1 ? 0 : data,
//             });
//           })
//           // *
//           .catch((ex) => {
//             res.status(400).json({
//               status: res.statusCode.toString(),
//               statusMessage: `${res.statusMessage}`,
//               type: "Cach:conn",
//               msg: ex,
//             });
//           });
//       })
//       //*
//       .catch((err) => {
//         console.error("Error getting connection from pool:", err);
//         res.status(400).json({
//           status: res.statusCode.toString(),
//           statusMessage: `${res.statusMessage}`,
//           type: "Cach:conn:Error getting connection from pool ",
//           msg: err,
//         });
//         //*
//       });
//   } catch (error) {
//     res.status(400).json({
//       status: res.statusCode.toString(),
//       statusMessage: `${res.statusMessage}`,
//       type: "Cach",
//       msg: error,
//     });
//   }
// });

const port = 3332;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port:  http://localhost:${port}`);
});
