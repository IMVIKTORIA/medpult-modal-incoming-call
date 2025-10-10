import React, { useEffect, useState } from "react";
import Scripts from "../../shared/utils/clientScripts";
import { ContractorsSearchData } from "../../shared/types.ts";
import ModalIncomingCall from "./ModalIncomingCall.tsx";
import Loader from "../../../UIKit/Loader/Loader";

/** Обёртка модального окна с контроллером видимости */
export default function ModalIncomingCallWrapper() {
  // Данные поиска контрагентов с одинаковым номером телефона
  const [contractorsSearchData, setContractorsSearchData] =
    useState<ContractorsSearchData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Scripts.OnInit().then(() => {
      const currentURL = new URL(window.location.href);
      const phone = currentURL.searchParams.get("phone") || undefined;
      const insuredId = currentURL.searchParams.get("insuredId") || undefined;
      const policyId = currentURL.searchParams.get("policyId") || undefined;

      const data: ContractorsSearchData = {};
      if (phone) data.phone = phone;
      if (insuredId) data.globalInsuredId = insuredId;
      if (policyId) data.globalPolicyId = policyId;

      setContractorsSearchData(data);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <ModalIncomingCall contractorsSearchData={contractorsSearchData} />
  );
}
