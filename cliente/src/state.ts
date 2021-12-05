import { rtdb } from "./rtdb";
import map from "lodash/map";

const API_BASE_URL = "http://localhost:3000";
let i = 0;
const state = {
  data: { email: "", fullName: "", userId: "", roomId: "", rtdbRoomId: "", messages: [] },
  listeners: [],
  init() {
    const lastStorageState = localStorage.getItem("saved-state");
    const data = JSON.parse(lastStorageState);
    if (data !== null) {
      const { email, fullName, userId, roomId, rtdbRoomId } = data;

      const cs = this.getState();
      cs.email = email;
      cs.fullName = fullName;
      cs.userId = userId;
      cs.roomId = roomId;
      cs.rtdbRoomId = rtdbRoomId;
      this.setState(cs);

      state.listenRoom();
    }
  },
  listenRoom() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref(`/rooms/${cs.rtdbRoomId}`);

    chatroomsRef.on("value", (snapShot) => {
      const messageFromServer = snapShot.val(); // ! Retorna Todo lo que contenga la RUTA
      const messagesList = map(messageFromServer.messages); // ! Crea un ARRAY de todos los mensajes ALMACENADOS en RTDB
      cs.messages = messagesList; // * Cada vez haya un cambio, se reemplazara ("Pisa") la info original
      this.setState(cs);
    });
  },
  getState() {
    return this.data;
  },
  pushMessage(message: string) {
    const cs = this.getState();
    const { rtdbRoomId, fullName } = cs;

    fetch(`${API_BASE_URL}/messages/${rtdbRoomId}`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from: fullName, msg: message }),
    });
  },
  setEmailAndFullName(email: string, fullName: string) {
    const cs = this.getState();
    cs.fullName = fullName;
    cs.email = email;
    this.setState(cs);
  },
  signUp(callBack?) {
    const cs = this.getState();
    if (cs.email && cs.fullName) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: cs.email, nombre: cs.fullName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callBack(); // ! Sin Error
        });
    } else {
      console.error("NO hay Email && Nombre en el State");
      callBack(true); // ! Con Error
    }
  },
  // ! Envio el Email y me Retorna el Id de Firestore Long
  authUser(callBack?) {
    const cs = this.getState();
    if (cs.email) {
      fetch(`${API_BASE_URL}/auth`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: cs.email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callBack(); // ! Sin Error
        });
    } else {
      console.error("NO hay Email en el State");
      callBack(true); // ! Con Error
    }
  },
  // ! Envio el Id de Firestore Long y Me retorena un Id Short
  askNewRoom(callBack?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(`${API_BASE_URL}/rooms`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          callBack();
        });
    } else {
      console.error("NO hay ID en el State");
      callBack(true);
    }
  },
  accessToRoom(callBack?) {
    const cs = this.getState();
    const { roomId, userId } = cs;
    if (userId && roomId) {
      fetch(`${API_BASE_URL}/rooms/${roomId}?userId=${userId}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.rtdbRoomId = data.rtdbRoomId;
          this.setState(cs);
          callBack();
        });
    } else {
      console.error("NO hay ID en el State");
      callBack(true);
    }
  },
  setState(newState) {
    this.data = newState;
    for (const cd of this.listeners) {
      cd();
    }
    localStorage.setItem("saved-state", JSON.stringify(newState)); // ! Guarda la DATA en el LocalStorage
    console.log(`Soy el State he cambiado ${i++}`);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
