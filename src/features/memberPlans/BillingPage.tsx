import { useState } from "react";
import { BillingHeader } from "./components/BillingList/BillingHeader";
import { BillingFilters } from "./components/BillingList/BillingFilters";
import { BillingTable } from "./components/BillingList/BillingTable";
import { FeeDetailModal } from "./components/FeeDetail/FeeDetailModal";
import { PaymentFormModal } from "./components/PaymentForm/PaymentFormModal";
import { useFeesQuery } from "./hooks/queries/useFeesQuery";
import { useBillingFilters } from "./hooks/useBillingFilters";
import type { Fee } from "./types";

interface BillingPageProps {
  initialSearch?: string;
}

export default function BillingPage({ initialSearch }: BillingPageProps = {}) {
  const {
    params,
    pagination,
    setPagination,
    filters,
    search,
    handleSearch,
    handleClearSearch,
    handleFilterChange,
    handleClearAllFilters,
  } = useBillingFilters(initialSearch);

  const { data, isLoading, isPlaceholderData } = useFeesQuery(params);

  const [detailFee, setDetailFee] = useState<Fee | null>(null);
  const [paymentFee, setPaymentFee] = useState<Fee | null>(null);

  const fees = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <BillingHeader />

      <BillingFilters
        searchValue={search}
        onSearch={handleSearch}
        onSearchClear={handleClearSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />

      <BillingTable
        data={fees}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onViewDetail={setDetailFee}
        onRegisterPayment={setPaymentFee}
      />

      <FeeDetailModal
        fee={detailFee}
        open={!!detailFee}
        onClose={() => setDetailFee(null)}
      />
      <PaymentFormModal
        fee={paymentFee}
        open={!!paymentFee}
        onClose={() => setPaymentFee(null)}
      />
    </div>
  );
}
