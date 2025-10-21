import React, { useEffect, useState } from "react";
import Scripts from "../../shared/utils/clientScripts";
import { ContractorListData, ContractorsSearchData } from "../../shared/types";
import icons from "../../shared/icons";
import utils, { redirectSPA, openContractor } from "../../shared/utils/utils";

type SearchContractorProps = {
  contractorsSearchData: ContractorsSearchData;
  selectedContractorsIds: string[];
};
export default function SearchContractor({
  contractorsSearchData,
  selectedContractorsIds,
}: SearchContractorProps) {
  const [contractors, setContractors] = useState<ContractorListData[]>([]);
  const [loading, setLoading] = useState(true);

  //Разделение составного Id
  function parseSelectedId(id: string): {
    contractorId: string;
    policyId?: string;
  } {
    const [contractorId, policyId] = id.split("_");
    return { contractorId, policyId };
  }

  useEffect(() => {
    async function fetchContractors() {
      setLoading(true);
      //Если есть выбранный контаргент
      if (selectedContractorsIds && selectedContractorsIds.length > 0) {
        const { contractorId, policyId } = parseSelectedId(
          selectedContractorsIds[0]
        );
        const contractor = await Scripts.getContractorById(
          contractorId,
          contractorsSearchData.phone,
          policyId
        );
        if (contractor?.data) {
          setContractors([contractor.data]);
          setLoading(false);
          return;
        }
      }
      // Если нет id — обычная логика
      const result = await Scripts.getContractorList(
        0,
        undefined,
        contractorsSearchData
      );
      const items = result.items.map((i) => i.data);
      setContractors(items);
      setLoading(false);
    }

    fetchContractors();
  }, [contractorsSearchData, selectedContractorsIds]);

  // useEffect(() => {
  //   async function fetchContractors() {
  //     setLoading(true);
  //     const result = await Scripts.getContractorList(
  //       0,
  //       undefined,
  //       contractorsSearchData
  //     );
  //     const items = result.items.map((i) => i.data);

  //     setContractors(items);
  //     setLoading(false);
  //   }
  //   fetchContractors();
  // }, [contractorsSearchData]);

  /** Обработчик нажатия на контрагента*/
  const onClickContractor = async (contractor: ContractorListData) => {
    const contractorId = contractor.id?.value;
    if (!contractorId) return;
    // Открыть контрагента
    openContractor(contractorId);
  };
  // Перейти на форму отбора контрагентов
  const searchContractor = () => {
    const link = Scripts.getSelectContractorPagePath();
    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (contractorsSearchData.phone)
      redirectUrl.searchParams.set("phone", contractorsSearchData.phone);
    if (contractorsSearchData.phone) utils.redirectSPA(redirectUrl.toString());
  };

  const applyMaskPhone = (value: string): string => {
    if (value === undefined) return "";
    const match = value.match(
      /(\+?7|8)\D*(\d{1,3})?\D*(\d{1,3})?\D*(\d{1,2})?\D*(\d{1,2})?/
    );
    if (!match) return "";
    return match
      .slice(1)
      .filter((val) => val)
      .join(" ")
      .replace(/^(7|8)/, "+7");
  };

  const contractor = contractors.length === 1 ? contractors[0] : undefined;
  return (
    <div className="search-contractor">
      <span className="search-contractor__title">Обратившийся</span>

      {contractor ? (
        <div className="search-contractor__content">
          <div
            className="search-contractor__field"
            style={{ maxWidth: "400px" }}
          >
            <span className="search-contractor__field__label">
              Наименование
            </span>
            <div className="search-contractor__field__group">
              <span
                className="search-contractor__field__value search-contractor__field__value__link"
                title={contractor?.fullname?.value}
                onClick={() => onClickContractor(contractor)}
              >
                {contractor?.isIntegration?.info &&
                  icons.IntegrationButtonSmall}
                {contractor?.fullname?.value}
              </span>
              <span
                className="search-contractor__field__button"
                onClick={() => searchContractor()}
              >
                {icons.Change} <span>Заменить</span>
              </span>
            </div>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "130px" }}
          >
            <span className="search-contractor__field__label">Телефон</span>
            <span
              className="search-contractor__field__value"
              title={contractor?.phone?.value}
            >
              {applyMaskPhone(contractor?.phone?.value ?? "")}
            </span>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "120px" }}
          >
            <span className="search-contractor__field__label">
              Дата рождения
            </span>
            <span
              className="search-contractor__field__value"
              title={contractor?.birthdate?.value}
            >
              {contractor?.birthdate?.value}
            </span>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "160px" }}
          >
            <span className="search-contractor__field__label">Полис</span>
            <span
              className="search-contractor__field__value"
              title={contractor?.policy?.value}
            >
              {contractor?.policy?.value}
            </span>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "120px" }}
          >
            <span className="search-contractor__field__label">
              Начало действия
            </span>
            <span
              className="search-contractor__field__value"
              title={contractor?.policyStartDate?.value}
            >
              {contractor?.policyStartDate?.value}
            </span>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "130px" }}
          >
            <span className="search-contractor__field__label">
              Окончание действия
            </span>
            <span
              className="search-contractor__field__value"
              title={contractor?.policyEndDate?.value}
              style={{
                color:
                  contractor?.policyEndDate?.isValid === false
                    ? "#ff4545"
                    : "#303337",
              }}
            >
              {contractor?.policyEndDate?.value}
            </span>
          </div>

          <div
            className="search-contractor__field"
            style={{ maxWidth: "120px" }}
          >
            <span className="search-contractor__field__label">
              Вид контрагента
            </span>
            <span
              className="search-contractor__field__value"
              title={contractor?.type?.value}
            >
              {contractor?.type?.value}
            </span>
          </div>

          <div className="search-contractor__field">
            <span className="search-contractor__field__label">Адрес</span>
            <span
              className="search-contractor__field__value"
              title={contractor?.adress?.value}
            >
              {contractor?.adress?.value}
            </span>
          </div>
        </div>
      ) : (
        <div className="search-contractor__search">
          <div className="search-contractor__field">
            <span className="search-contractor__field__label">
              Наименование
            </span>
            <div className="search-contractor__field__group">
              <span
                className="search-contractor__field__button"
                onClick={() => searchContractor()}
              >
                {icons.Search20} <span>Поиск</span>
              </span>
            </div>
          </div>

          <div className="search-contractor__field">
            <span className="search-contractor__field__label">Телефон</span>
            <span
              className="search-contractor__field__value"
              title={contractorsSearchData.phone}
            >
              {contractorsSearchData.phone}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
