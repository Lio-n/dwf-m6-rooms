customElements.define(
  "custom-form",
  class extends HTMLElement {
    shadow: ShadowRoot;
    btn: string;
    input: string;
    label: string;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.btn = this.getAttribute("btn") || "";
      this.input = this.getAttribute("input") || "";
      this.label = this.getAttribute("label") || "";

      const style = document.createElement("style");
      style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box; font-family: 'Roboto', sans-serif;}
      .remove{
        display: none;
      }
      .open{
        display: inherit;
      }
      .form{
        width: 312px;
      }
      input, button{
        height: 55px;
        width: 100%;
        border-radius: 5px
      }
      button{
        display: inherit;
        margin-top: 1rem;
        background-color: #9CBBE9;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
      button:hover{
        background-color: #a8cbff;
      }
      input{
        margin-top: 5px;
        padding: 15px;
        border: solid 1px;
      }
      .form__warning{
        color: #e60026;
        margin-top: 5px;
      }
      .form__label {
        font-size: 24px;
      }
      `;
      this.shadow.appendChild(style);
      this.render();
    }
    render() {
      const div = document.createElement("div");
      div.innerHTML = `
        <form class="form">
          <div>
            <label class="form__label">${this.label}</label>
          </div>
          <input type="text" name="${this.input}">
          <h4 class="form__warning remove">Por favor ingresa tu nombre</h4>
          <button>${this.btn}</button>
        </form>
    `;
      this.shadow.appendChild(div);
    }
  }
);
