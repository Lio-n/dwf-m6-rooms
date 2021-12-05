import { state } from "../state";

type Message = {
  from: string;
  msg: string;
};

class ChatPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
    });
    this.render();
  }
  messages: Message[] = [];
  addListener() {
    const div = this.shadow.querySelector("div");
    const shadowRoot = div.querySelector("custom-form").shadowRoot;
    const form = shadowRoot.querySelector(".form");
    const input = form.querySelector("input");

    input.setAttribute("placeholder", "Enviar Mensage..");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const inputMsg = target["new-message"].value;
      if (inputMsg !== "") {
        state.pushMessage(inputMsg);
      }
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box; font-family: 'Roboto', sans-serif;}
    .title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    .messages {
      height: 300px;
      width: 312px;
      overflow-x: hidden; /* Disable horizontal scroll */
    }
    .anotherMsg {
      display: inherit;
      font-size: 14px;
      color: var(--name-msg);
    }
    .myMsg {
      display: flex;
      justify-content: end;
    }
    .myUser,
    .anotherUser {
      background: var(--my-msg);
      padding: 0.5rem;
      display: inline-flex;
      margin: 5px 0 0.5rem;
      max-width: 180px;
    }
    .anotherUser {
      background: var(--another-msg);
      color: #000;
    }
    .chat__roomdId {
      font-size: 1.4rem;
      color: hsl(215, 32%, 27%);
    }
      `;
    const { fullName, roomId } = state.getState();

    this.shadow.innerHTML = `
      <div>
        <h1 class="title">Chat</h1>
        <h2 class="chat__roomdId">Room Id: ${roomId}</h2>
        <div class="messages">
          ${this.messages
            .map((m) => {
              return `<div class="message ${m.from == fullName ? "myMsg" : "anotherMsg"}">
                        <span class="anotherMsg">${m.from == fullName ? "" : m.from}</span>
                        <span class="user__message ${
                          m.from == fullName ? "myUser" : "anotherUser"
                        }">${m.msg}</span>
                      </div>`;
            })
            .join("")}
        </div>
        <custom-form btn="Enviar" input="new-message"> </custom-form>
      </div>
      `;

    this.shadow.appendChild(style);
    this.addListener();
  }
}

customElements.define("chat-page", ChatPage);
