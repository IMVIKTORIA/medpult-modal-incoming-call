import React, { useEffect, useState } from "react";
import CustomList from "../../../UIKit/CustomList/CustomList";
import {
  MyItemData,
  ItemDataString,
  ListColumnData,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { FetchData } from "../../../UIKit/CustomList/CustomListTypes.ts";
import { ContractorsSearchData, TaskListData } from "../../shared/types";
import Scripts from "../../shared/utils/clientScripts";
import CustomInput from "../../../UIKit/CustomInput/CustomInput";
import SliderPanel from "../SliderPanel/SliderPanel";
import utils, { useDebounce, openNewTask } from "../../shared/utils/utils";
import Button from "../../../UIKit/Button/Button";
import icons from "../../shared/icons";
import CustomInputSelect from "../CustomInputSelect/CustomInputSelect";

/** Данные поиска обращений */
export interface TaskSearchData extends ContractorsSearchData {
  /** Поисковый запрос */
  searchQuery?: string;
  /** Идентификаторы выбранных обратившихся */
  contractorsIds?: string[];
  /** Идентификаторы выбранных обращений */
  requestsIds?: string[];
  /** Идентификаторы выбранных застрахованных */
  insuredIds?: string[];
  /** Показывать закрытые задачи */
  isShowClosed?: boolean;
  /** Поле, по которому выполняется поиск */
  searchField?: string;
  /** id застрахованного */
  globalInsuredId?: string;
  /** id полис */
  globalPolicyId?: string;
}

export type TaskListProps = {
  /** Идентификаторы выбранных застрахованных */
  selectedInsuredIds: string[];
  /** Выбранные обращения */
  selectedRequestsIds: string[];
  /** Поисковые данные контрагента */
  contractorsSearchData: ContractorsSearchData;
  /** Выбранные задачи */
  selectedTasksIds: string[];
  /** Установить выбранные задачи */
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<string[]>>;
  /** Показывать закрытые задачи */
  sliderActive?: boolean;
  /** Изменить значение показывать закрытые задачи */
  setSliderActive?: React.Dispatch<React.SetStateAction<boolean>>;
  /** Иденификаторы выбранных обратившихся */
  selectedContractorsIds: string[];
};

/** Список задач */
export default function TaskList({
  selectedInsuredIds,
  selectedRequestsIds,
  contractorsSearchData,
  selectedTasksIds,
  setSelectedTasksIds,
  sliderActive,
  setSliderActive,
  selectedContractorsIds,
}: TaskListProps) {
  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isClosedRequest, setIsClosedRequest] = useState(false);
  const [isClosedTask, setIsClosedTask] = useState(false);

  //Закрыто ли обращение
  useEffect(() => {
    const checkRequestStatus = async () => {
      if (!selectedRequestsIds?.length) {
        setIsClosedRequest(false);
        return;
      }

      const requestId = selectedRequestsIds[0];
      const closed = await Scripts.isRequestClosed(requestId);
      setIsClosedRequest(closed);
    };

    checkRequestStatus();
  }, [selectedRequestsIds]);

  //Закрыта ли задача
  useEffect(() => {
    const checkTaskStatus = async () => {
      if (!selectedTasksIds?.length) {
        setIsClosedTask(false);
        return;
      }

      const taskId = selectedTasksIds[0];
      const closed = await Scripts.isTaskClosed(taskId);
      setIsClosedTask(closed);
    };

    checkTaskStatus();
  }, [selectedTasksIds]);

  // Значение с debounce
  const searchQueryDebounced = useDebounce(searchQuery, 500);

  /** Обработчик нажатия на номер задачи */
  const onClickNumberTask = async (task: MyItemData<string>) => {
    const taskId = task.info;
    if (!taskId) return;

    const requestId = await Scripts.getRequestIdByTaskId(taskId);
    utils.setTask(requestId);
    localStorage.setItem("taskId", taskId);

    // Переход
    const link = await Scripts.getRequestPagePath();

    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (requestId) redirectUrl.searchParams.set("request_id", requestId);
    if (taskId) redirectUrl.searchParams.set("task_id", taskId);
    //utils.redirectSPA(redirectUrl.toString());
    window.open(redirectUrl.toString(), "_blank");
  };

  /** Обработчик нажатия на кнопку "Привязать к задаче"  */
  const bindTask = async () => {
    if (!selectedTasksIds?.length || !selectedContractorsIds?.length) {
      showErrorMessage("Выберите обратившегося и задачу в активном статусе");
      return;
    }
    const phone = contractorsSearchData.phone || "";

    const selectedContractors = selectedContractorsIds[0] ?? "";
    // Если id составной (contractorId_policyId) — берем только первую часть
    const contractorId = selectedContractors.includes("_")
      ? selectedContractors.split("_")[0]
      : selectedContractors;

    const success = await Scripts.createInteractionByTaskId(
      selectedTasksIds[0],
      contractorId,
      phone
    );
    if (!success) {
      showErrorMessage("Выберите обратившегося и задачу в активном статусе");
      return;
    }

    const requestId = await Scripts.getRequestIdByTaskId(selectedTasksIds[0]);
    utils.setTask(requestId);
    localStorage.setItem("taskId", selectedTasksIds[0]);

    // Переход
    const link = await Scripts.getRequestPagePath();

    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (requestId) redirectUrl.searchParams.set("request_id", requestId);
    if (selectedTasksIds[0])
      redirectUrl.searchParams.set("task_id", selectedTasksIds[0]);
    utils.redirectSPA(redirectUrl.toString());
    //window.open(redirectUrl.toString(), "_blank");
  };

  // Вспомогательная функция для показа ошибок
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };
  /** Обработчик нажатия на кнопку "Создать задачу"  */
  const newTask = async () => {
    if (!selectedRequestsIds?.length || !selectedContractorsIds?.length) {
      showErrorMessage("Выберите обратившегося и обращение в активном статусе");
      return;
    }
    const selectedContractors = selectedContractorsIds[0] ?? "";
    // Если id составной (contractorId_policyId) — берем только первую часть
    const contractorId = selectedContractors.includes("_")
      ? selectedContractors.split("_")[0]
      : selectedContractors;

    if (contractorsSearchData.phone) {
      //Открыть форму создания задачи
      const success = await openNewTask(
        contractorsSearchData.phone,
        contractorId,
        selectedRequestsIds[0]
      );
      if (!success) {
        showErrorMessage(
          "Выберите обратившегося и обращение в активном статусе"
        );
      }
    }
  };
  /** Колонки списка */
  const columns = [
    new ListColumnData({
      name: "Номер задачи",
      code: "number",
      fr: 1,
      isSortable: true,
      isLink: true,
      onClick: onClickNumberTask,
    }),
    new ListColumnData({
      name: "Дата создания",
      code: "createdAt",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Тип задачи",
      code: "type",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Вид задачи",
      code: "sort",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Статус",
      code: "statusTask",
      fr: 1,
      isSortable: true,
      isIcon: true,
    }),
    new ListColumnData({
      name: "Форма согласования",
      code: "formApproval",
      fr: 1,
    }),
    new ListColumnData({
      name: "Описание задачи",
      code: "description",
      fr: 2,
    }),
  ];

  /** Данные поиска */
  const getSearchDataWithQuery = (): TaskSearchData => {
    return {
      ...contractorsSearchData,
      searchQuery: searchQueryDebounced,
      requestsIds: selectedRequestsIds,
      insuredIds: selectedInsuredIds,
      contractorsIds: selectedContractorsIds,
      isShowClosed: sliderActive,
      searchField: selectedSearchField,
    };
  };

  const searchFieldsCode = columns.filter((col) =>
    ["number", "sort", "statusTask", "description"].includes(col.code)
  );
  const searchOptions = searchFieldsCode.map((col) => ({
    code: col.code,
    name: col.name,
  }));
  const [selectedSearchField, setSelectedSearchField] = useState<string>(
    searchOptions[0].code
  );
  const selectedFieldName = searchOptions.find(
    (o) => o.code === selectedSearchField
  )?.name;

  const [searchDataWithQuery, setSearchDataWithQuery] =
    useState<TaskSearchData>(() => getSearchDataWithQuery());

  const isDisabled = selectedTasksIds.length === 0 || isClosedTask;

  useEffect(() => {
    setSearchDataWithQuery(getSearchDataWithQuery());
  }, [
    searchQueryDebounced,
    selectedRequestsIds,
    selectedInsuredIds,
    selectedContractorsIds,
    contractorsSearchData,
    sliderActive,
  ]);

  const isDisabledAdd =
    selectedContractorsIds.length === 0 ||
    selectedRequestsIds.length === 0 ||
    isClosedRequest;

  return (
    <>
      <div className="request-list">
        <div className="request-list__search">
          <div className="request-list__search__button">
            {/* Поле поиска */}
            <CustomInputSelect
              value={searchQuery}
              setValue={setSearchQuery}
              cursor="text"
              placeholder="Поиск"
              buttons={icons.Search}
              searchFields={searchOptions.map((o) => o.name)}
              selectedField={selectedFieldName}
              setSelectedField={(name) => {
                const col = searchOptions.find((o) => o.name === name);
                if (col) setSelectedSearchField(col.code);
              }}
            />
            <SliderPanel
              title="Закрытые задачи"
              isVisible={sliderActive ?? false}
              setIsVisible={(isActive) => {
                if (setSliderActive) setSliderActive(isActive);
              }}
            />
          </div>
          <div className="request-list__button">
            <Button
              title={"Привязать к задаче"}
              clickHandler={bindTask}
              icon={icons.AddLink}
              style={{
                backgroundColor: "#21A038",
                opacity: isDisabled ? "0.4" : "1",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            />

            <Button
              title={"Создать задачу"}
              clickHandler={newTask}
              icon={icons.AddButton}
              style={{
                opacity: isDisabledAdd ? "0.4" : "1",
                cursor: isDisabledAdd ? "not-allowed" : "pointer",
              }}
            />
          </div>
        </div>
        <div className="request-list__list">
          <CustomList<TaskSearchData, TaskListData>
            columnsSettings={columns}
            getDataHandler={Scripts.getTaskList}
            isScrollable={true}
            searchFields={selectedSearchField ? [selectedSearchField] : []}
            searchData={searchDataWithQuery}
            isSelectable={true}
            isMultipleSelect={false}
            setSelectedItems={(ids: string[]) => setSelectedTasksIds(ids)}
            selectedItems={selectedTasksIds}
          />
        </div>
      </div>
      {/* Всплывашка */}
      {errorMessage && <div className="alert-error">{errorMessage}</div>}
    </>
  );
}
