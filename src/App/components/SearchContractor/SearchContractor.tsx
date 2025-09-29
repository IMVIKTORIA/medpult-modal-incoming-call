import React, { useEffect, useState } from "react";
import Scripts from "../../shared/utils/clientScripts";
import { ContractorListData } from "../../shared/types";
import icons from "../../shared/icons";
import utils, { redirectSPA, openContractor } from "../../shared/utils/utils";

type SearchContractorProps = {
  phone: any;
};
export default function SearchContractor({ phone }: SearchContractorProps) {
  const [contractor, setContractor] = useState<ContractorListData | null>(null);

  useEffect(() => {
    async function fetchContractor() {
      const data = await Scripts.getContractor(phone);
      setContractor(data);
    }
    fetchContractor();
  }, []);

  /** Обработчик нажатия на контрагента*/
  const onClickContractor = async (contractor: ContractorListData) => {
    const contractorId = contractor.id?.value;
    if (!contractorId) return;
    // Открыть контрагента
    openContractor(contractorId);
  };
  // Перейти на форму отбора контрагентов
  const searchContractor = () => {
    localStorage.setItem("medpult-call-phone", phone);
    redirectSPA(
      "<%=Context.data.select_contractors_path%>?field_id=medpult-worktable-call&&phone=" +
        encodeURI(phone)
    );
  };

  return (
    <div className="search-contractor">
      <span className="search-contractor__title">Обратившийся</span>
      <div className="search-contractor__content">
        {contractor ? (
          <>
            <div className="search-contractor__field">
              <span className="search-contractor__field__label">
                Наименование
              </span>
              <div className="search-contractor__field__group">
                <span
                  className="search-contractor__field__value search-contractor__field__value__link"
                  title={contractor?.fullname?.value}
                  onClick={() => searchContractor()}
                >
                  {contractor?.fullname?.value}
                </span>
                <span
                  className="search-contractor__field__button"
                  onClick={() => onClickContractor(contractor)}
                >
                  {icons.Change} <span>Заменить</span>
                </span>
              </div>
            </div>

            <div className="search-contractor__field">
              <span className="search-contractor__field__label">Телефон</span>
              <span
                className="search-contractor__field__value"
                title={contractor?.phone?.value}
              >
                {contractor?.phone?.value}
              </span>
            </div>

            <div className="search-contractor__field">
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

            <div className="search-contractor__field">
              <span className="search-contractor__field__label">Полис</span>
              <span
                className="search-contractor__field__value"
                title={contractor?.policy?.value}
              >
                {contractor?.policy?.value}
              </span>
            </div>

            <div className="search-contractor__field">
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

            <div className="search-contractor__field">
              <span className="search-contractor__field__label">
                Окончание действия
              </span>
              <span
                className="search-contractor__field__value"
                title={contractor?.policyEndDate?.value}
              >
                {contractor?.policyEndDate?.value}
              </span>
            </div>

            <div className="search-contractor__field">
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
          </>
        ) : (
          <>
            <div className="search-contractor__field">
              <span className="search-contractor__field__label">
                Наименование
              </span>
              <div className="search-contractor__field__group">
                <span
                  className="search-contractor__field__button"
                  onClick={() => searchContractor()}
                >
                  {icons.Search} <span>Поиск</span>
                </span>
              </div>
            </div>

            <div className="search-contractor__field">
              <span className="search-contractor__field__label">Телефон</span>
              <span className="search-contractor__field__value" title={phone}>
                {phone}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
