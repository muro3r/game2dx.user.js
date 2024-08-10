export class ArenaActivePlayerCounter extends HTMLElement {
  #single: number | null = null;
  #double: number | null = null;

  textElement = document.createElement("p");

  connectedCallback() {
    const frameElement = document.createElement("div");
    frameElement.setAttribute("class", "frame");

    this.textElement.innerText = this.text;

    frameElement.append(this.textElement);

    this.append(frameElement);
  }

  set single(val: number) {
    this.#single = val;

    this.textElement.innerText = this.text;
  }

  set double(val: number) {
    this.#double = val;

    this.textElement.innerText = this.text;
  }

  get text() {
    return `30分以内にプレーした人数: SP: ${this.#single ?? "--"}人 DP: ${
      this.#double ?? "--"
    }人`;
  }
}
