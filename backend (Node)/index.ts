import { firestore, rtdb } from "./db";
import * as express from "express";
import { nanoid } from "nanoid";
import * as cors from "cors";

const Port = "3000";
const app = express();
app.use(express.json());
app.use(cors());

const userColl = firestore.collection("users");
const roomsColl = firestore.collection("rooms");

// ! Crear Un USER
app.post("/signup", (req, res) => {
  const { email, nombre } = req.body;
  userColl
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      // * Si el user esta VACIO, entonces no existe
      // * Por lo tanto CREO uno y lo añado a la userColl
      if (searchResponse.empty) {
        userColl
          .add({
            email,
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "User Already exists",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { email } = req.body;
  userColl
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id, // ! Retorna el Id de la Firestore LONG
        });
      }
    });
});

// ! Crear una ROOM
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  userColl
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref(`rooms/${nanoid()}`);
        roomRef
          .set({
            message: [],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key; // ! Obtiene el ID que se genera en RTDB
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsColl
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "User Not exists",
        });
      }
    });
});
// ! Unirse una ROOM EXISTENTE
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  userColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsColl
          .doc(roomId.toString())
          .get()
          .then((snap) => {
            const data = snap.data();
            console.log("/rooms/:roomID", data);

            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "User Not exists",
        });
      }
    });
});

// ! Message
app.post("/messages/:msgId", (req, res) => {
  const { msgId } = req.params;
  const { from, msg } = req.body;
  rtdb.ref(`/rooms/${msgId}/messages`).push({ from, msg }, (err) => {
    if (err) {
      res.status(400).json({
        message: "Your message could not be processed",
      });
    } else {
      res.status(200).json({
        message: "Your message can be processed",
      });
    }
  });
});
app.listen(Port, () => {
  console.log(`Aplicación ejemplo, escuchando el puerto ${Port}!`);
});
