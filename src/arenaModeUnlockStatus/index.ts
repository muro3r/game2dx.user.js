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

  const element = createElement(unlockStatus);

  const divElement = document.createElement("div");

  divElement.setAttribute("class", "arena-cube");
  divElement.appendChild(element);

  arenaCubeElement.insertAdjacentElement("afterend", divElement);
}

function createElement(unlockStatus: ArenaUnlockStauts[]): HTMLTableElement {
  const table = document.createElement("table");

  const header = document.createElement("tr");

  const header1Cell = document.createElement("th");
  header1Cell.innerText = "開催期間";
  header.appendChild(header1Cell);

  const header2Cell = document.createElement("th");
  header2Cell.innerText = "解禁状況";
  header2Cell.colSpan = 2;
  header.appendChild(header2Cell);

  table.appendChild(header);

  for (const status of unlockStatus.reverse()) {
    const row = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.innerText = `${status.id}回`;
    row.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.innerText = `${status.data[0] ? "○" : "×"}`;
    row.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.innerText = `${status.data[1] ? "○" : "×"}`;

    row.appendChild(cell3);
    table.appendChild(row);
  }

  return table;
}

export interface ArenaPeriod {
  eventCount: number;
  begin: Date;
  end: Date;
  cubeCount: number;
}

export type ArenaUnlockStauts = { id: number; data: [boolean, boolean] };

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
  const table = html.querySelector("table");
  if (!table) {
    throw new Error("table not found");
  }

  const rows = [
    ...(table.querySelectorAll(
      "tr:has(td)",
    ) as unknown as HTMLTableRowElement[]),
  ];

  const result: ArenaPeriod[] = [];

  for (const row of rows) {
    result.push(parseTableRow(row));
  }

  return result;
}

function parseTableRow(tableRow: HTMLTableRowElement): ArenaPeriod {
  const cells = Array.from(tableRow.querySelectorAll("td"));

  const [_eventCountText, _br, durationText] = Array.from(
    cells[0].childNodes,
  ).map((node) => node.textContent);

  if (!_eventCountText || !durationText) {
    throw new Error("invalid table row");
  }

  const eventCount = Number(_eventCountText.match(/\d+/));

  const [beginDateText, endDateText] = durationText.split("～");

  const begin = new Date(beginDateText);
  const end = new Date(endDateText);
  const cubeCount = Number(cells[1].textContent?.match(/^\d+/));

  return {
    eventCount,
    begin,
    end,
    cubeCount,
  };
}
