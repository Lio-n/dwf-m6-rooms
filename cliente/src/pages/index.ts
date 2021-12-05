import { Router } from "@vaadin/router";
import { state } from "../state";
import "../components/form/form";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();

    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box; font-family: 'Roboto', sans-serif;}
      .home__title {
        font-size: 2.5rem;
        margin-bottom: 2rem;
      }
      .WngRoomId {
        color: var(--wng-alert);
        margin-top: 5px;
      }
      .remove {
        display: none;
      }
      .open {
        display: inherit;
      }
      .home__form {
        width: 312px;
      }
      input,
      button {
        height: 55px;
        width: 100%;
        border-radius: 5px;
      }
      button {
        display: inherit;
        margin-top: 1rem;
        background-color: var(--btn);
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
      button:hover {
        background-color: var(--btn-hover);
      }
      input {
        margin-top: 5px;
        padding: 15px;
        border: solid 1px;
        font-size: 1rem;
      }
      .form__subtitle {
        margin-top: 13px;
      }
      .form__selectOp {
        height: 55px;
        width: 100%;
        font-size: 1rem;
      }
      `;
    this.shadow.appendChild(style);

    const form = this.shadow.querySelector(".home__form");
    // ! Alert Input Empty
    const nombreInput = form["nombre"];
    const emailInput = form["email"];
    const roomIdInput = form["roomId"];

    const wngSelectOp = form.querySelector(".WngRoomId");
    const selectOp = form.querySelector(".form__selectOp");
    const roomId: any = form.querySelector(".form__roomId");

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
    const div = document.createElement("div");
    div.innerHTML = `
      <h1 class="home__title">Bienvenidos</h1>
      <form class="home__form">
        <h3 class="form__subtitle">Email</h3>
        <input type="text" name="email">

        <h3 class="form__subtitle">Nombre</h3>
        <input type="text" name="nombre">

        <h3 class="form__subtitle">Room</h3>
        <select class="form__selectOp" name="option">
          <option value="1">Nueva Room</option>
          <option value="2">Room Existente</option>
        </select>
        
        <div class="form__roomId" style="display: none;">
          <h3 class="form__subtitle">Room ID</h3>
          <input type="text" name="roomId">
        </div>
        <h4 class="WngRoomId remove">Only Numbers, Example "4513"</h4>
        
        <button>Enviar</button>
      </form>
    `;

    this.shadow.appendChild(div);
  }
}

customElements.define("home-page", Home);
