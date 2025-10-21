import {
  FetchData,
  MyItemData,
  ItemDataString,
  ItemDataStringArray,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { formatPhone } from "../../../UIKit/shared/utils/utils";
import { InsuredSearchData } from "../../components/InsuredList/InsuredList";
import { RequestSearchData } from "../../components/RequestList/RequestList";
import { TaskSearchData } from "../../components/TaskList/TaskList";
import {
  ContractorListData,
  ContractorsSearchData,
  ContractorsSearchDataExtended,
  InsuredListData,
  RequestListData,
  TaskListData,
} from "../types";
/** Заглушка ожидания ответа сервера */
function randomDelay() {
  const delay = Math.random() * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/** Получение списка обратившихся */
async function getContractorList(
  page: number,
  sortData?: SortData,
  searchData?: ContractorsSearchDataExtended
): Promise<FetchData<ContractorListData>> {
  const mockData: ContractorListData = {
    /** Идентификатор */
    id: new ItemDataString("1"),
    isIntegration: new MyItemData({ value: "", info: true }),
    fullname: new MyItemData({
      value: "Иванов Иван Иванович",
      info: `${Math.random() * 10000}`,
    }),
    phone: new ItemDataString(formatPhone("79998887766")),
    birthdate: new ItemDataString("01.01.1991"),
    policy: new ItemDataString("00SB755380849982/1"),
    policyStartDate: new ItemDataString("20.01.2025"),
    policyEndDate: { value: "20.01.2026", isValid: false },
    type: new ItemDataString("Застрахованный"),
    adress: new ItemDataString("г. Москва, ул. Тверская 121/1"),
  };
  await randomDelay();

  return {
    items: Array(10)
      .fill(0)
      .map((data, index) => {
        return {
          id: String(index),
          data: new ContractorListData(mockData),
        };
      }),
    hasMore: false,
  };
}

/** Получение обратившегося */
async function getContractorById(
  contractorId: string,
  phone?: string,
  policyId?: string
): Promise<{ id: string; data: ContractorListData } | null> {
  const mockData: ContractorListData = {
    /** Идентификатор */
    id: new ItemDataString("1"),
    isIntegration: new MyItemData({ value: "", info: true }),
    fullname: new MyItemData({
      value: "Иванов Иван Иванович",
      info: `${Math.random() * 10000}`,
    }),
    phone: new ItemDataString(formatPhone("79998887766")),
    birthdate: new ItemDataString("01.01.1991"),
    policy: new ItemDataString("00SB755380849982/1"),
    policyStartDate: new ItemDataString("20.01.2025"),
    policyEndDate: { value: "20.01.2026", isValid: false },
    type: new ItemDataString("Застрахованный"),
    adress: new ItemDataString("г. Москва, ул. Тверская 121/1"),
  };
  await randomDelay();

  return {
    id: contractorId,
    data: new ContractorListData(mockData),
  };
}

/** Получение списка застрахованных */
async function getInsuredList(
  page: number,
  sortData?: SortData,
  searchData?: InsuredSearchData
): Promise<FetchData<InsuredListData>> {
  await randomDelay();
  const mockData: InsuredListData = {
    isIntegration: new MyItemData({ value: "", info: Math.random() < 0.5 }),
    fullname: new MyItemData({
      value: "Иванов Иван Иванович",
      info: `${Math.round(Math.random() * 10000)}`,
    }),
    birthdate: new ItemDataString("01.01.1991"),
    phone: new ItemDataString(formatPhone("79998887766")),
    email: new ItemDataString(formatPhone("79998887766")),

    policy: new ItemDataString("00SB755380849982/1"),
    policyStartDate: new ItemDataString("20.01.2025"),
    policyEndDate: { value: "20.01.2026", isValid: Math.random() < 0.5 },
  };

  return {
    items: Array(10)
      .fill(0)
      .map((data, index) => {
        return {
          id: String(index),
          data: {
            ...new InsuredListData(mockData),
          },
        };
      }),
    hasMore: true,
  };
}

/** Получение списка обращений */
async function getRequestList(
  page: number,
  sortData?: SortData,
  searchData?: RequestSearchData
): Promise<FetchData<RequestListData>> {
  await randomDelay();
  const statusList = [
    { info: "sozdano", value: "Создано" },
    { info: "vrabote", value: "В работе" },
    { info: "utochnenie-zaprosa", value: "Уточнение запроса" },
    { info: "v-ozhidanii", value: "В ожидании" },
    { info: "otkryto", value: "Открыто" },
    { info: "zakryto", value: "Закрыто" },
  ];

  const items = Array(13)
    .fill(0)
    .map((_, index) => {
      const status = statusList[index % statusList.length];
      const mockData: RequestListData = {
        id: new ItemDataString(`${index}`),
        number: new MyItemData({
          value: `RW00000${index}/24`,
          info: `id__${index}`,
        }),
        createdAt: new ItemDataString("01.01.1990 14:17"),
        channel: new ItemDataString("Телефон"),
        topic: new ItemDataString("Согласование медицинских услуг"),
        statusRequest: new MyItemData({
          value: status.value,
          info: status.info,
        }),
        reason: new ItemDataString(
          "Информация о состоянии здоровья предоставляется пациенту лично лечащим врачом или другими медицинскими работниками.Информация о состоянии здоровья предоставляется пациенту лично лечащим врачом или другими медицинскими работниками.Информация о состоянии здоровья предоставляется пациенту лично лечащим врачом или другими медицинскими работниками."
        ),
      };
      return {
        id: String(index),
        data: new RequestListData(mockData),
      };
    });

  return {
    items,
    hasMore: true,
  };
}

/** Получение списка задач */
async function getTaskList(
  page: number,
  sortData?: SortData,
  searchData?: TaskSearchData
): Promise<FetchData<TaskListData>> {
  await randomDelay();
  const statusTaskList = [
    { info: "queue", value: "В очереди" },
    { info: "atWork", value: "В работе" },
    { info: "control", value: "Контроль" },
    { info: "postpone", value: "Отложена" },
    { info: "complete", value: "Выполнено" },
    { info: "returned", value: "Возвращена" },
  ];

  const items = Array(13)
    .fill(0)
    .map((_, index) => {
      const statusTask = statusTaskList[index % statusTaskList.length];
      const mockData: TaskListData = {
        id: new ItemDataString(`${index}`),
        number: new MyItemData({ value: `TS00000${index}/24`, info: "" }),
        createdAt: new ItemDataString("01.01.1990 14:17"),
        type: new ItemDataString("Медицинское"),
        sort: new ItemDataString("Запись к врачу"),
        statusTask: new MyItemData({
          value: statusTask.value,
          info: statusTask.info,
        }),
        formApproval: new ItemDataString("Устное"),
        description: new ItemDataString(
          "Согласовать запись к Терапевту, Хирургу и Травматологу по месту жительства"
        ),
      };
      return {
        id: String(index),
        data: new TaskListData(mockData),
      };
    });

  return {
    items,
    hasMore: true,
  };
}

/** Получить количество обратившихся*/
async function getCountConractor(searchData: ContractorsSearchData) {
  await randomDelay();
  return 4;
}
/** Получить количество застрахованных*/
async function getCountInsured(searchData: ContractorsSearchData) {
  await randomDelay();
  return 10;
}
/** Получить количество обращений*/
async function getCountRequest(
  contractorsIds: string[],
  searchData: ContractorsSearchData,
  isShowClosed: boolean,
  tasksIds: string[]
) {
  await randomDelay();
  return 4;
}
/** Получить количество задач*/
async function getCountTask(
  contractorsIds: string[],
  searchData: ContractorsSearchData,
  isShowClosed: boolean
) {
  await randomDelay();
  return 10;
}

declare const Context: any;

/** Получение кода страницы Обращение */
function getRequestPagePath(): string {
  return "Context.data.request_page_path";
}

async function getRequestIdByTaskId(taskId: string): Promise<string> {
  return "test";
}

/** Получение кода страницы Контрагента */
function getContractorPageCode(): string {
  // return "contractor";
  return "";
}

/** Получение кода страницы Отбора застрахованных */
function getSelectInsuredPagePath(): string {
  return "";
}
/** Получение кода страницы Отбора контрагентов */
function getSelectContractorPagePath(): string {
  return "";
}

/** Получить количество отфильтрованных застрахованных по выбранному обратившемуся */
async function getFilteredInsuredCount(
  contractorsIds: string[],
  contractorsSearchData: ContractorsSearchData,
  requestIds: string[],
  tasksIds: string[]
) {
  await randomDelay();
  // TODO: Логика
  return Math.floor(Math.random() * 10);
}
/** Получить количество отфильтрованных обращений по выбранному Застрахованному */
async function getFilteredRequestsCount(
  contractorsIds: string[],
  insuredIds: string[],
  contractorsSearchData: ContractorsSearchData,
  isShowClosed: boolean,
  tasksIds: string[]
) {
  await randomDelay();
  // TODO: Логика
  return Math.floor(Math.random() * 10);
}
/** Получить количество отфильтрованных задач по выбранному обращению */
async function getFilteredTasksCount(
  contractorsIds: string[],
  requestsIds: string[],
  insuredIds: string[],
  contractorsSearchData: ContractorsSearchData,
  isShowClosed: boolean
) {
  await randomDelay();
  // TODO: Логика
  return Math.floor(Math.random() * 10);
}

async function createRequestForContractor(
  phone: string,
  contractorId?: string,
  insuredId?: string,
  policyId?: string
): Promise<string | undefined> {
  return "0197c997-a1df-71ea-88e2-0c9ec3d1f792";
}

async function createTaskForContractor(
  phone: string,
  contractorId?: string,
  requestsId?: string
): Promise<boolean | undefined> {
  return false;
}
async function createInteractionByRequestId(
  requestId: string,
  contractorId: string,
  phone: string
): Promise<boolean | undefined> {
  return;
}

async function createInteractionByTaskId(
  taskId: string,
  contractorId: string,
  phone: string
): Promise<boolean | undefined> {
  return;
}

async function isRequestClosed(requestId: string): Promise<boolean> {
  return false;
}

async function isTaskClosed(requestId: string): Promise<boolean> {
  return false;
}

async function OnInit(): Promise<void> {
  await randomDelay();
}
export default {
  getContractorList,
  getInsuredList,
  getRequestList,
  getTaskList,

  getContractorById,

  getCountConractor,
  getCountInsured,
  getCountRequest,
  getCountTask,

  getRequestPagePath,
  getSelectInsuredPagePath,
  getRequestIdByTaskId,
  getContractorPageCode,
  getSelectContractorPagePath,

  getFilteredInsuredCount,
  getFilteredRequestsCount,
  getFilteredTasksCount,

  createRequestForContractor,
  createTaskForContractor,

  createInteractionByRequestId,
  createInteractionByTaskId,

  isRequestClosed,
  isTaskClosed,

  OnInit,
};
