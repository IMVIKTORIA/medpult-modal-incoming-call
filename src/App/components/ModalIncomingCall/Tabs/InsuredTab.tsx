import React, { useEffect, useState, useCallback } from "react";
import TabItem from "../../../../UIKit/Tabs/TabItem/TabItem.tsx";
import Scripts from "../../../shared/utils/clientScripts.ts";
import InsuredList, {
  InsuredListProps,
} from "../../InsuredList/InsuredList.tsx";

/** Список застрахованных */
export default function InsuredTab(props: InsuredListProps) {
  const {
    contractorsSearchData,
    selectedInsuredIds,
    setSelectedInsuredIds,
    selectedContractorsIds,
    selectedRequestsIds,
    selectedTasksIds,
  } = props;

  // Общее количество застрахованных
  const [insuredCount, setInsuredCount] = useState<number>(0);

  // Количество отфильтрованных застрахованных
  const [filteredInsuredCount, setFilteredInsuredCount] = useState<number>(0);

  // Обновление количества отфильтрованных по застрахованным застрахованных
  async function updateFilteredInsuredCount(totalCount: number) {
    // Если обратившийся не выбран, то обращения не фильтруются
    if (!selectedContractorsIds.length)
      return setFilteredInsuredCount(totalCount);
    // При выбранном обратившемся получить количество застрахованных по этому обратившемуся с указанными фильтрами
    const count = await Scripts.getFilteredInsuredCount(
      selectedContractorsIds,
      contractorsSearchData,
      selectedRequestsIds,
      selectedTasksIds
    );
    setFilteredInsuredCount(count);
  }

  // Обновить количества
  async function updateCounts() {
    //const totalCount = await Scripts.getCountInsured(contractorsSearchData);
    if (
      (!selectedContractorsIds || selectedContractorsIds.length === 0) &&
      !contractorsSearchData.globalInsuredId
    ) {
      setInsuredCount(0);
      setFilteredInsuredCount(0);
      return;
    }
    if (contractorsSearchData.globalInsuredId) {
      setInsuredCount(1);
      setFilteredInsuredCount(1);
      return;
    }
    if (
      (selectedRequestsIds && selectedRequestsIds.length > 0) ||
      (selectedTasksIds && selectedTasksIds.length > 0)
    ) {
      setInsuredCount(1);
      setFilteredInsuredCount(1);
      return;
    }
    const totalCount = 0;
    await updateFilteredInsuredCount(totalCount);

    setInsuredCount(totalCount);
  }

  // При изменении выбранного застрахованного, фильтров или общего количества застрахованных
  useEffect(() => {
    setIsLoading(true);
    updateCounts().then(() => setIsLoading(false));
  }, [
    selectedContractorsIds,
    contractorsSearchData,
    selectedRequestsIds,
    selectedTasksIds,
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  function getCountString(count: number) {
    return isLoading ? "--" : `${count}`;
  }

  const countTitle = (
    <span className="count">{getCountString(filteredInsuredCount)}</span>
  );

  // Вкладка застрахованные
  return (
    <TabItem code={"insuredContragen"} name={<>Застрахованные {countTitle}</>}>
      <InsuredList
        selectedInsuredIds={selectedInsuredIds}
        setSelectedInsuredIds={setSelectedInsuredIds}
        contractorsSearchData={contractorsSearchData}
        selectedContractorsIds={selectedContractorsIds}
        selectedRequestsIds={selectedRequestsIds}
        selectedTasksIds={selectedTasksIds}
      />
    </TabItem>
  );
}
