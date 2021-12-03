import { Router } from "@vaadin/router";
import { state } from "../state";
import "../components/form/form";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = this.querySelector("form");
    // ! Alert Input Empty
    const nombreInput = form["nombre"];
    const emailInput = form["email"];
    const roomIdInput = form["roomId"];

    const wngSelectOp = form.querySelector(".form__roomId");
    const selectOp = form.querySelector(".form__selectOp");
    const roomId: any = form.querySelector(".ContRoomId");

    selectOp.addEventListener("click", (e) => {
      e.preventDefault();
      const { value } = e.target as any;
      let menu = false;
      if (!menu && value == 2) {
        roomId.style.display = "block";
        wngSelectOp.classList.add("open");
        wngSelectOp.classList.remove("remove");

        menu = true;
      } else {
        roomId.style.display = "none";
        wngSelectOp.classList.remove("open");
        wngSelectOp.classList.add("remove");

        menu = false;
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { nombre, email, roomId } = e.target as any;

      // ! Alert Input Empty
      let menu = false;
      if (!menu) {
        nombre.value == "" || null
          ? (nombreInput.style.border = "3px solid #e60026")
          : nombreInput.style.removeProperty("border");
        email.value == "" || null
          ? (emailInput.style.border = "3px solid #e60026")
          : emailInput.style.removeProperty("border");
        roomIdInput.value == "" || null
          ? (roomIdInput.style.border = "3px solid #e60026")
          : roomIdInput.style.removeProperty("border");
        menu = true;
      }

      state.setEmailAndFullName(email.value, nombre.value);

      if (roomId.value !== "" || null) {
        const cs = state.getState();
        cs.roomId = roomId.value;
        state.setState(cs);
        state.signUp((err) => {
          if (err) {
            console.error("There was an error in sign");
          } else {
            state.authUser((err) => {
              if (err) {
                console.error("There was an error in auth");
              } else {
                state.accessToRoom((err) => {
                  if (err) {
                    console.error("There was an error in AccessToRoom");
                  } else {
                    state.listenRoom();
                    Router.go("/chat");
                  }
                });
              }
            });
          }
        });
      } else {
        state.signUp((err) => {
          if (err) {
            console.error("There was an error in sign");
          } else {
            state.authUser((err) => {
              if (err) {
                console.error("There was an error in auth");
              } else {
                state.askNewRoom((err) => {
                  if (err) {
                    console.error("There was an error in askNewRoom");
                  } else {
                    state.accessToRoom((err) => {
                      if (err) {
                        console.error("There was an error in AccessToRoom");
                      } else {
                        state.listenRoom();
                        Router.go("/chat");
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  render() {
    this.innerHTML = `
      <h1 class="title">Bienvenidos</h1>
      <form>
        <h3 class="form__subtitle">Email</h3>
        <input type="text" name="email">

        <h3 class="form__subtitle">Nombre</h3>
        <input type="text" name="nombre">

        <h3 class="form__subtitle">Room</h3>
        <select class="form__selectOp" name="option">
          <option value="1">Nueva Room</option>
          <option value="2">Room Existente</option>
        </select>
        
        <div class="ContRoomId" style="display: none;">
          <h3 class="form__subtitle">Room ID</h3>
          <input type="text" name="roomId">
        </div>
        <h4 class="form__roomId WngRoomId remove">Only Numbers, Example "4513"</h4>
        
        <button>Enviar</button>
      </form>
    `;
  }
}

customElements.define("home-page", Home);
