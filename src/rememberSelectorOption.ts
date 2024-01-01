const { pathname } = location;

const keyFormat = (name: string) => `${pathname}:${name}`;

/** 変更値を sessionStorage に保存する */
const onChangeSelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;

  const name = target.name;
  const value = target.value;

  sessionStorage.setItem(keyFormat(name), value);
};

/** 設定値をセッションストレージから取得して設定する */
const loadValueFromStorage = (select: HTMLSelectElement) => {
  const { name, value } = select;

  const storageValue = sessionStorage.getItem(keyFormat(name));

  if (!storageValue) {
    sessionStorage.setItem(keyFormat(name), value);
    return;
  }

  select.value = storageValue;
};

export default async function main() {
  const selectElementList =
    document.querySelectorAll<HTMLSelectElement>("select");

  if (selectElementList.length === 0) {
    return;
  }

  for (const selectElement of Array.from(selectElementList)) {
    loadValueFromStorage(selectElement);

    selectElement.addEventListener("change", onChangeSelect);
  }
}
