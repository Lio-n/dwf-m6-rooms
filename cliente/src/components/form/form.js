customElements.define("custom-form", class extends HTMLElement {
    shadow;
    btn;
    input;
    label;
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
          <button>${this.btn}</button>
        </form>
    `;
        this.shadow.appendChild(div);
    }
});
