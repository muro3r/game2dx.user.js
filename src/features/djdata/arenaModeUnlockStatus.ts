export function arenaModeUnlockStatus() {
  const arenaCubeElement = document.querySelector("div.arena-cube");
  if (!arenaCubeElement) {
    throw new Error("arenaCubeElement not found");
  }

  const arenaPeriod = parseTable(arenaCubeElement);
  const unlockStatus = checkArenaUnlockStatus(
    arenaPeriod,
    Math.max(...arenaPeriod.map((p) => p.eventCount)),
  );

  const divElement = document.createElement("div");
  divElement.setAttribute("class", "arena-cube");

  const element = createTableHeader();
  divElement.appendChild(element);

  const unlockStatusListElements = createUnlockStatusList(unlockStatus);

  for (const p of unlockStatusListElements) {
    divElement.appendChild(p);
  }

  const notice = document.createElement("p");
  notice.setAttribute("class", "notice");
  notice.innerText = "※ 1曲目の解禁は60個、2曲目の解禁は120個です。";
  divElement.appendChild(notice);

  arenaCubeElement.insertAdjacentElement("afterend", divElement);
}

function createTableHeader(): HTMLTableElement {
  const table = document.createElement("table");

  const header = document.createElement("tr");

  const header1Cell = document.createElement("th");
  header1Cell.innerText = "開催期間";
  header.appendChild(header1Cell);

  const header2Cell = document.createElement("th");
  header2Cell.innerText = "解禁状況 (1曲目)";
  header.appendChild(header2Cell);

  const header3Cell = document.createElement("th");
  header3Cell.innerText = "解禁状況 (2曲目)";
  header.appendChild(header3Cell);

  table.appendChild(header);

  return table;
}

export interface ArenaPeriod {
  eventCount: number;
  begin: Date;
  end: Date;
  cubeCount: number;
}

export type ArenaUnlockStauts = { id: number; data: [boolean, boolean] };

function createUnlockStatusList(
  unlockStatus: ArenaUnlockStauts[],
): HTMLUListElement[] {
  const result: HTMLUListElement[] = [];

  for (const status of unlockStatus.reverse()) {
    const ul = document.createElement("ul");
    ul.setAttribute("class", "cube");

    const cell1 = document.createElement("li");
    cell1.innerText = `第${status.id}回`;
    ul.appendChild(cell1);

    const cell2 = document.createElement("li");
    cell2.innerText = `${status.data[0] ? "○" : "×"}`;
    ul.appendChild(cell2);

    const cell3 = document.createElement("li");
    cell3.innerText = `${status.data[1] ? "○" : "×"}`;

    ul.appendChild(cell3);

    result.push(ul);
  }

  return result;
}

export function checkArenaUnlockStatus(
  arenaPeriod: ArenaPeriod[],
  greatestEventCount: number,
): ArenaUnlockStauts[] {
  const result: ArenaUnlockStauts[] = [];

  for (let i = 1; i <= greatestEventCount; i++) {
    const period = arenaPeriod.find((p) => p.eventCount === i);

    if (!period) {
      result.push({ id: i, data: [false, false] });
      continue;
    }

    if (period.cubeCount >= 120) {
      result.push({ id: period.eventCount, data: [true, true] });
    } else if (period.cubeCount > 60 && period.cubeCount < 120) {
      result.push({ id: period.eventCount, data: [true, false] });
    } else {
      result.push({ id: period.eventCount, data: [false, false] });
    }

    if (period.cubeCount >= 120 + 60) {
      let unlockCount = Math.floor((period.cubeCount - 120) / 60);

      while (unlockCount > 0) {
        const targetIndex = result.findIndex((value) =>
          value.data.some((v) => !v),
        );

        if (!targetIndex) {
          break;
        }

        const lockedSongCount = result[targetIndex].data.filter(
          (v) => !v,
        ).length;

        if (lockedSongCount === 2) {
          result[targetIndex] = { ...result[targetIndex], data: [true, true] };

          unlockCount = -2;
        } else if (lockedSongCount === 1) {
          result[targetIndex] = { ...result[targetIndex], data: [true, true] };

          unlockCount = -1;
        }
      }
    }
  }

  return result;
}

export function parseTable(html: Element): ArenaPeriod[] {
  const rows = [
    ...(html.querySelectorAll("ul") as unknown as HTMLTableRowElement[]),
  ];

  return rows.map(parseTableRow);
}

function parseTableRow(tableRow: HTMLTableRowElement): ArenaPeriod {
  const cells = Array.from(tableRow.querySelectorAll("li"));

  const eventCount = Number(
    cells[0].querySelector("b")?.textContent?.match(/\d+/)?.[0],
  );
  const durationText = cells[0].querySelector("span")?.textContent;

  if (!(eventCount && durationText)) {
    throw new Error("invalid table row");
  }

  const [beginDateText, endDateText] = durationText.split("～");

  const begin = new Date(beginDateText);
  const end = new Date(endDateText);
  const cubeCount = Number(cells[1].textContent?.match(/^\d+/));
  const stockBonus = Number(cells[2].textContent?.match(/\d+/));

  return {
    eventCount,
    begin,
    end,
    cubeCount: cubeCount + stockBonus,
  };
}
