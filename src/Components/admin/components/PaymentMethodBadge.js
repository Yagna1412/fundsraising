import React from "react";
import { getPaymentMethodLabel, getPaymentMethodMeta } from "../../../constants/paymentMethods";

const PaymentMethodBadge = ({ method, short = false }) => {
  const meta = getPaymentMethodMeta(method);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${meta.badgeClass}`}>
      {getPaymentMethodLabel(method, { short })}
    </span>
  );
};

export default PaymentMethodBadge;
