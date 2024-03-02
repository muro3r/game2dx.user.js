export class ArenaActivePlayerCounter extends HTMLDivElement {
  #single: number | null = null;
  #double: number | null = null;

  textElement = document.createElement("p");

  constructor() {
    super();

    this.classList.add("frame");

    this.textElement.innerText = this.text;
    this.append(this.textElement);
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
    return `1時間以内にプレーした人数: SP: ${this.#single ?? "--"}人 DP: ${
      this.#double ?? "--"
    }人`;
  }
}
