import React, { useEffect, useState } from "react";
import Scripts from "../../shared/utils/clientScripts.ts";
import { ContractorsSearchData } from "../../shared/types.ts";
import ModalIncomingCall from "./ModalIncomingCall.tsx";

/** Обёртка модального окна с контроллером видимости */
export default function ModalIncomingCallWrapper() {
  // Состояние видимости модального окна
  const [isShowModal, setIsShowModal] = useState<boolean>();
  // Данные поиска контрагентов с одинаковым номером телефона
  const [contractorsSearchData, setContractorsSearchData] =
    useState<ContractorsSearchData>({});
  useEffect(() => {
    // Установить функцию обновления видимости модального окна извне
    Scripts.setUpdateShowModalCallback((isShowModal: boolean) =>
      setIsShowModal(isShowModal)
    );
    // Установить функцию обновления данных поиска контрагента вне виджета
    Scripts.setUpdateSearchDataCallback((searchData: ContractorsSearchData) =>
      setContractorsSearchData(searchData)
    );
  }, []);

  return (
    <>
      {isShowModal && (
        <ModalIncomingCall contractorsSearchData={contractorsSearchData} />
      )}
    </>
  );
}
