import React, { useEffect, useState, useCallback } from "react";
import RequestList, {
  RequestListProps,
} from "../../RequestList/RequestList.tsx";
import TabItem from "../../../../UIKit/Tabs/TabItem/TabItem.tsx";
import Scripts from "../../../shared/utils/clientScripts.ts";

/** Список обращений */
export default function RequestsTab(props: RequestListProps) {
  const { selectedInsuredIds, contractorsSearchData, selectedContractorsIds } =
    props;

  //Состояние слайдера
  const [sliderActive, setSliderActive] = useState(false);
  // Общее количество обращений
  const [requestCount, setRequestCount] = useState<number>(0);

  const effectiveInsuredIds = contractorsSearchData?.globalInsuredId
    ? [contractorsSearchData.globalInsuredId]
    : selectedInsuredIds;

  // Обновить общее количество обращений
  async function updateRequestCount() {
    if (
      !selectedContractorsIds?.length &&
      !contractorsSearchData?.globalInsuredId
    ) {
      setRequestCount(0);
      return;
    }
    const count = await Scripts.getCountRequest(
      selectedContractorsIds,
      contractorsSearchData
    );
    setRequestCount(count);
  }

  // Количество отфильтрованных обращений
  const [filteredRequestsCount, setFilteredRequestsCount] = useState<number>(0);
  // Обновление количества отфильтрованных по застрахованным обращений
  async function updateFilteredRequestsCount() {
    if (!effectiveInsuredIds?.length) {
      setFilteredRequestsCount(0);
      return;
    }
    // При выбранном застрахованном получить количество обращений по этому застрахованному с указанными фильтрами
    const count = await Scripts.getFilteredRequestsCount(
      selectedContractorsIds,
      effectiveInsuredIds,
      contractorsSearchData,
      sliderActive
    );
    setFilteredRequestsCount(count);
  }

  // Обновить количества
  async function updateCounts() {
    await updateRequestCount();
    await updateFilteredRequestsCount();
  }

  // При изменении выбранного застрахованного, фильтров или общего количества обращений
  useEffect(() => {
    setIsLoading(true);
    updateCounts().then(() => setIsLoading(false));
  }, [
    selectedInsuredIds,
    selectedContractorsIds,
    contractorsSearchData,
    sliderActive,
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  function getCountString(count: number) {
    return isLoading ? "--" : `${count}`;
  }

  const countTitle = (
    <span className="count">
      {getCountString(
        effectiveInsuredIds?.length ? filteredRequestsCount : requestCount
      )}
    </span>
  );

  // Вкладка обращения
  return (
    <TabItem code={"requests"} name={<>Обращения {countTitle}</>}>
      <RequestList
        {...props}
        sliderActive={sliderActive}
        setSliderActive={setSliderActive}
      />
    </TabItem>
  );
}
