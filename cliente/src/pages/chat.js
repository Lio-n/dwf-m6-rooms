import { state } from "../state";
class ChatPage extends HTMLElement {
    connectedCallback() {
        state.subscribe(() => {
            const currentState = state.getState();
            this.messages = currentState.messages;
            this.render();
        });
        this.render();
    }
    messages = [];
    addListener() {
        const shadowRoot = this.querySelector("custom-form").shadowRoot;
        const form = shadowRoot.querySelector(".form");
        const input = form.querySelector("input");
        input.setAttribute("placeholder", "Enviar Mensage..");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target;
            const inputMsg = target["new-message"].value;
            if (inputMsg !== "") {
                state.pushMessage(inputMsg);
            }
        });
    }
    render() {
        const { fullName } = state.getState();
        this.innerHTML = `
      <div>
        <h1 class="title">Chat</h1>
        <div class="messages">
          ${this.messages
            .map((m) => {
            return `<div class="message ${m.from == fullName ? "myMsg" : "anotherMsg"}">
                        <span class="anotherMsg">${m.from == fullName ? "" : m.from}</span>
                        <span class="user__message ${m.from == fullName ? "myUser" : "anotherUser"}">${m.msg}</span>
                      </div>`;
        })
            .join("")}
        </div>
        <custom-form btn="Enviar" input="new-message"> </custom-form>
      </div>
      `;
        this.addListener();
    }
}
customElements.define("chat-page", ChatPage);
