import * as admin from "firebase-admin"; //Libreria
import * as serviceAccount from "./key.json"; //Key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any), //Autentifico con mi key "serviceAccount"
  databaseURL: "https://apx-dwf-m6-c29ec-default-rtdb.firebaseio.com", //Direccion de mi Proyecto "apx-dwf-m6"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
