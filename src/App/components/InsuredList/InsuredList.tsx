import React, { useEffect, useState } from "react";
import CustomList from "../../../UIKit/CustomList/CustomList";
import {
  MyItemData,
  ListColumnData,
  FetchData,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { ContractorsSearchData, InsuredListData } from "../../shared/types";

import Scripts from "../../shared/utils/clientScripts";
import CustomInput from "../../../UIKit/CustomInput/CustomInput";
import utils, {
  openContractor,
  openContractorInEditMode,
  openNewRequest,
  redirectSPA,
  useDebounce,
} from "../../shared/utils/utils";
import Button from "../../../UIKit/Button/Button";
import icons from "../../shared/icons";
import CustomInputSelect from "../CustomInputSelect/CustomInputSelect";
import ColumnWithValidation from "../ColumnWithValidation/ColumnWithValidation";

/** Пропсы Модального окна */
export type InsuredListProps = {
  /** Идентификаторы выбранных застрахованных */
  selectedInsuredIds: string[];
  /** Установить идентификаторы выбранных застрахованных */
  setSelectedInsuredIds: React.Dispatch<React.SetStateAction<string[]>>;
  /** Поисковые данные контрагента */
  contractorsSearchData: ContractorsSearchData;
  /** Иденификаторы выбранных обратившихся */
  selectedContractorsIds: string[];
  /** Иденификаторы выбранных обращения */
  selectedRequestsIds: string[];
  /** Иденификаторы выбранных задач */
  selectedTasksIds: string[];
};

/** Данные поиска дубликатов застрахованного */
export interface InsuredSearchData extends ContractorsSearchData {
  /** Данные поисковой строки */
  searchQuery?: string;
  /** Поле, по которому выполняется поиск */
  searchField?: string;
  /** Выбранные обратившиеся */
  contractorsIds?: string[];
  /** id застрахованного */
  globalInsuredId?: string;
  /** id полиса */
  globalPolicyId?: string;
  /** Выбранные обращения */
  requestIds?: string[];
  /** Выбранные задачи */
  tasksIds?: string[];
}

/** Список застрахованных */
export default function InsuredList({
  selectedInsuredIds,
  setSelectedInsuredIds,
  contractorsSearchData,
  selectedContractorsIds,
  selectedRequestsIds,
  selectedTasksIds,
}: InsuredListProps) {
  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Значение с debounce
  const searchQueryDebounced = useDebounce(searchQuery, 500);

  /** Обработчик нажатия на кнопку "Глобальный поиск"  */
  const onClickSearchContractor = async () => {
    // Открыть форму отбора застрахованных
    const link = Scripts.getSelectInsuredPagePath();
    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (contractorsSearchData.phone)
      redirectUrl.searchParams.set("phone", contractorsSearchData.phone);
    utils.redirectSPA(redirectUrl.toString());
  };

  /** Обработчик нажатия на кнопку "Редактировать"  */
  const onClickEdit = async () => {
    if (!selectedInsuredIds.length) {
      showErrorMessage("Выберите контрагента");
      return;
    }
    const selected = selectedInsuredIds[0];
    // Если id составной (contractorId_policyId) — берем только первую часть
    const contractorId = selected.includes("_")
      ? selected.split("_")[0]
      : selected;
    openContractorInEditMode(contractorId);
  };

  // Вспомогательная функция для показа ошибок
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };

  /** Обработчик нажатия на кнопку "Создать обращение"  */
  const newRequest = async () => {
    if (!selectedContractorsIds.length) {
      showErrorMessage("Выберите обратившегося");
      return;
    }

    const selectedContractors = selectedContractorsIds[0] ?? "";
    // Если id составной (contractorId_policyId) — берем только первую часть
    const contractorId = selectedContractors.includes("_")
      ? selectedContractors.split("_")[0]
      : selectedContractors;

    const selected = selectedInsuredIds[0] ?? "";
    let insuredId = "";
    let policyId = "";

    if (selected.includes("_")) {
      const [contractorPart, policyPart] = selected.split("_");
      insuredId = contractorPart;
      policyId = policyPart;
    } else {
      insuredId = selected;
    }

    if (contractorsSearchData.phone)
      // Открыть форму создания обращения
      openNewRequest(
        contractorsSearchData.phone,
        contractorId,
        insuredId,
        policyId
      );
  };

  /** Обработчик нажатия на застрахованного */
  const onClickContractor = async (contractor: MyItemData<string>) => {
    const contractorId = contractor.info;
    if (!contractorId) return;
    // Открыть контрагента
    openContractor(contractorId);
  };

  /** Колонки списка */
  const columns = [
    new ListColumnData({
      name: "",
      code: "isIntegration",
      fr: 0.2,
      isIcon: true,
    }),
    new ListColumnData({
      name: "ФИО",
      code: "fullname",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Дата рождения",
      code: "birthdate",
      fr: 1,
      isSortable: true,
    }),
    new ListColumnData({
      name: "Телефон",
      code: "phone",
      fr: 1,
    }),
    new ListColumnData({
      name: "Email",
      code: "email",
      fr: 1,
    }),
    new ListColumnData({
      name: "Полис",
      code: "policy",
      fr: 1,
    }),
    new ListColumnData({
      name: "Начало действия",
      code: "policyStartDate",
      fr: 1,
    }),
    new ListColumnData({
      name: "Окончание действия",
      code: "policyEndDate",
      fr: 1,
      getCustomColumComponent: ColumnWithValidation,
    }),
  ];

  /** Данные поиска */
  const searchFieldsCode = columns.filter((col) =>
    ["fullname", "policy"].includes(col.code)
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
    useState<InsuredSearchData>({
      ...contractorsSearchData,
      searchQuery: searchQueryDebounced,
      searchField: selectedSearchField,
      contractorsIds: selectedContractorsIds,
      requestIds: selectedRequestsIds,
      tasksIds: selectedTasksIds,
    });
  useEffect(() => {
    setSearchDataWithQuery({
      ...contractorsSearchData,
      searchQuery: searchQueryDebounced,
      searchField: selectedSearchField,
      contractorsIds: selectedContractorsIds,
      requestIds: selectedRequestsIds,
      tasksIds: selectedTasksIds,
    });
  }, [
    contractorsSearchData,
    searchQueryDebounced,
    selectedSearchField,
    selectedContractorsIds,
    selectedRequestsIds,
    selectedTasksIds,
  ]);

  const handleGetData = async (
    page: number,
    sortData?: SortData,
    searchData?: InsuredSearchData
  ): Promise<FetchData<InsuredListData>> => {
    //Если нет выбранных контрагентов и нет insuredId — вернуть пустой список
    const hasNoContractors = !searchData?.contractorsIds?.length;
    const hasNoInsured = !searchData?.globalInsuredId;
    if (hasNoContractors && hasNoInsured) {
      return {
        items: [],
        hasMore: false,
      };
    }

    const response = await Scripts.getInsuredList(page, sortData, searchData);

    return response;
  };

  const isDisabledEdit = selectedInsuredIds.length === 0;
  const isDisabledAdd = selectedContractorsIds.length === 0;

  return (
    <>
      <div className="insured-list">
        <div className="insured-list__search">
          <div className="insured-list__search__button">
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
            <Button
              title={"Глобальный поиск"}
              clickHandler={onClickSearchContractor}
            />
          </div>
          <div className="insured-list__button">
            <Button
              title={"Редактировать"}
              clickHandler={() => onClickEdit()}
              icon={icons.EditButton}
              buttonType="outline"
              style={{
                opacity: isDisabledEdit ? "0.4" : "1",
                cursor: isDisabledEdit ? "not-allowed" : "pointer",
              }}
            />
            <Button
              title={"Создать обращение"}
              clickHandler={newRequest}
              icon={icons.AddButton}
              style={{
                opacity: isDisabledAdd ? "0.4" : "1",
                cursor: isDisabledAdd ? "not-allowed" : "pointer",
              }}
            />
          </div>
        </div>
        <div className="insured-list__list">
          <CustomList<InsuredSearchData, InsuredListData>
            columnsSettings={columns}
            searchData={searchDataWithQuery}
            searchFields={selectedSearchField ? [selectedSearchField] : []}
            getDataHandler={handleGetData}
            isScrollable={true}
            isSelectable={true}
            isMultipleSelect={false}
            setSelectedItems={(ids: string[]) => setSelectedInsuredIds(ids)}
            selectedItems={selectedInsuredIds}
          />
        </div>
      </div>

      {/* Всплывашка */}
      {errorMessage && <div className="alert-error">{errorMessage}</div>}
    </>
  );
}
