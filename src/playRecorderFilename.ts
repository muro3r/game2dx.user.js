interface Detail {
  /** 楽曲名 */
  songTitle: string;
  /** 譜面 */
  score: string;
  /** プレー店舗 */
  store: string;
  /** プレー日時 */
  playedAt: string;
  /** 保存期限 */
  expiredAt: string;
}

class DetailParser {
  constructor(private readonly element: HTMLDivElement) {
    this.element = element;
  }

  private convertToDetail(elemData: { [key: string]: string }): Detail {
    const songTitle = elemData.楽曲名;
    const score = elemData.譜面;
    const store = elemData.プレー店舗;
    const playedAt = elemData.プレー日時;
    const expiredAt = elemData.保存期限;

    return {
      songTitle,
      score,
      store,
      playedAt,
      expiredAt,
    };
  }

  parse(): Detail {
    const elemData = Array.from(
      this.element.querySelectorAll<HTMLParagraphElement | HTMLSpanElement>(
        "[data-name]",
      ),
    ).reduce((prev, curr) => {
      const name = curr.getAttribute("data-name");
      const value = curr.innerText;

      if (!name || !value) {
        return prev;
      }

      return {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        ...prev,
        [name]: value,
      };
    }, {});

    return this.convertToDetail(elemData);
  }
}

export default function main() {
  const elem = document.querySelector<HTMLDivElement>(
    "#section > div > div > div:nth-child(2)",
  );

  if (!elem) {
    return;
  }

  const parser = new DetailParser(elem);
  const data = parser.parse();

  // 2021/09/01 00:00:00 -> 20210901 000000
  const _playedAt = data.playedAt.replace(/(:|\/)/gi, "");

  const fileNameElement = document.createElement("div");
  fileNameElement.classList.add("inner");
  // プレイ日時 楽曲名 譜面 (プレー店舗)
  fileNameElement.innerText = `${_playedAt} ${data.songTitle} ${data.score} (${data.store})`;

  document
    .querySelector(".inner")
    ?.insertAdjacentElement("afterend", fileNameElement);
}
