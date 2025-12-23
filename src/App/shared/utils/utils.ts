import { useEffect, useState } from "react";
import { localStorageDraftKey } from "./constants";
import icons from "../icons";
import Scripts from "./clientScripts";

/** Маршрутизация по SPA */
export const redirectSPA = (href: string) => {
  let element = document.createElement("a");
  element.href = href;
  element.style.display = "none";
  document.querySelector("body")?.appendChild(element);
  element.click();
  element.remove();
};

/** Маршрутизация по SPA с использовнием URL и проверкой текущего пути */
export const redirectSPAWithURL = (redirectUrl: URL) => {
  if (window.location.pathname == redirectUrl.pathname) {
    // Если ссылка с тем же путем, то перезагрузить страницу
    window.history.pushState(null, "", redirectUrl.toString());
    window.location.reload();
  } else {
    // Иначе стандартная логика
    redirectSPA(redirectUrl.toString());
  }
};

/** Запись идентификатора обращения в localStorage
 * @param id Идентификатор обращения
 */
async function setRequest(id: string) {
  localStorage.setItem("currentRequestId", id);
  localStorage.setItem("currentContractorId", "");
  localStorage.setItem("currentContractorPhone", "");
}

async function setTask(id: string) {
  localStorage.setItem("currentTaskId", id);
  localStorage.setItem("currentContractorId", "");
  localStorage.setItem("currentContractorPhone", "");
}

/** Получение данных формы из черновика */
export function getDataFromDraft() {
  // Получение данных из черновика
  const draftData = localStorage.getItem(localStorageDraftKey);
  localStorage.removeItem(localStorageDraftKey);
  if (draftData) {
    return JSON.parse(draftData);
  }
}

export function useDebounce<ValueType = any>(
  value: ValueType,
  delay: number
): ValueType {
  // Состояние и сеттер для отложенного значения
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Выставить debouncedValue равным value (переданное значение)
      // после заданной задержки
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Вернуть функцию очистки, которая будет вызываться каждый раз, когда ...
      // ... useEffect вызван снова. useEffect будет вызван снова, только если ...
      // ... value будет изменено (смотри ниже массив зависимостей).
      // Так мы избегаем изменений debouncedValue, если значение value ...
      // ... поменялось в рамках интервала задержки.
      // Таймаут очищается и стартует снова.
      // Что бы сложить это воедино: если пользователь печатает что-то внутри ...
      // ... нашего приложения в поле поиска, мы не хотим, чтобы debouncedValue...
      // ... не менялось до тех пор, пока он не прекратит печатать дольше, чем 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Вызывается снова, только если значение изменится
    // мы так же можем добавить переменную "delay" в массива зависимостей ...
    // ... если вы собираетесь менять ее динамически.
    [value]
  );

  return debouncedValue;
}

export function saveState<ValueType>(state: ValueType) {
  let stateStr: string;

  try {
    stateStr = JSON.stringify(state);
  } catch (e) {
    throw new Error("Ошибка приведения состояния к строке: " + e);
  }

  localStorage.setItem(localStorageDraftKey, stateStr);
}

export function getStatusRequestColor(status: any) {
  switch (status) {
    case "sozdano":
      return "#CADEFA";
    case "vrabote":
      return "#F8E0C4";
    case "utochnenie-zaprosa":
      return "#EBE9FE";
    case "v-ozhidanii":
      return "#E9EAEB";
    case "zakryto":
      return "#CBEAD1";
    case "otkryto":
      return "#F7D1CE";
    default:
  }
}

export function getStatusTaskIcon(status: any) {
  switch (status) {
    case "queue":
      return "#1570EF";
    case "atWork":
      return "#DC7703";
    case "control":
      return "#7A5AF8";
    case "postpone":
      return "#717680";
    case "complete":
      return "#21A038";
    case "returned":
      return "#D92D20";
    default:
      return;
  }
}

/** Открыть контрагента */
export function openContractor(contractorId?: string) {
  if (!contractorId) return;

  window.localStorage.setItem(
    "medpultPathBefore",
    window.location.pathname + window.location.search
  );
  localStorage.setItem("medpultContractorId", contractorId);

  const link = Scripts.getContractorPageCode();
  const redirectUrl = new URL(window.location.origin + "/" + link);

  //redirectSPAWithURL(redirectUrl);
  window.open(redirectUrl.toString(), "_blank");
}

/** Открыть контрагента */
export function openContractorInEditMode(contractorId?: string) {
  if (!contractorId) return;

  window.localStorage.setItem(
    "medpultPathBefore",
    window.location.pathname + window.location.search
  );
  localStorage.setItem("medpultContractorId", contractorId);

  const link = Scripts.getContractorPageCode();
  const redirectUrl = new URL(window.location.origin + "/" + link);
  redirectUrl.searchParams.set("is_edit", "true");

  window.open(redirectUrl.toString());
  //redirectSPAWithURL(redirectUrl);
}

//Отркыть форму создания обращения
export async function openNewRequest(
  phone: string,
  contractorId?: string,
  insuredId?: string,
  policyId?: string
) {
  if (!contractorId) return;

  window.localStorage.removeItem("medpult-draft");
  const requestId = await Scripts.createRequestForContractor(
    phone,
    contractorId,
    insuredId,
    policyId
  );

  const link = Scripts.getRequestPagePath();
  const redirectUrl = new URL(window.location.origin + "/" + link);
  if (requestId) redirectUrl.searchParams.set("request_id", requestId);
  //window.open(redirectUrl.toString(), "_blank");
  redirectSPAWithURL(redirectUrl);
}

//Отркыть форму создания задачи
export async function openNewTask(
  phone: string,
  contractorId?: string,
  requestId?: string
): Promise<boolean> {
  if (!contractorId || !requestId) return false;

  window.localStorage.removeItem("medpult-draft");

  const taskCreated = await Scripts.createTaskForContractor(
    phone,
    contractorId,
    requestId
  );
  if (!taskCreated) return false;

  const link = Scripts.getRequestPagePath();
  const redirectUrl = new URL(window.location.origin + "/" + link);
  if (requestId) redirectUrl.searchParams.set("request_id", requestId);
  redirectUrl.searchParams.set("create-task", "new");
  //window.open(redirectUrl.toString(), "_blank");
  redirectSPAWithURL(redirectUrl);

  return true;
}

export default {
  redirectSPA,
  setRequest,
  setTask,
  getDataFromDraft,
  saveState,
  getStatusRequestColor,
  getStatusTaskIcon,
};
