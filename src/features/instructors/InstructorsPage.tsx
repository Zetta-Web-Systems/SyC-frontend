import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { confirm } from "@shared/stores/confirm.store";
import { toast } from "@shared/stores/toast.store";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import { toApiPage } from "@shared/utils/pagination.utils";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { useInstructorsQuery } from "./hooks/useInstructorsQuery";
import { useDeleteInstructorMutation } from "./hooks/useDeleteInstructorMutation";
import { InstructorsTable } from "./components/InstructorsTable/InstructorsTable";
import { InstructorFormModal } from "./components/InstructorFormModal/InstructorFormModal";
import { InstructorsFilters } from "./components/InstructorsFilters/InstructorsFilters";
import type { Instructor } from "./types";

const ORDER_MAP: Record<
  string,
  { orderBy: string; orderType: "ASC" | "DESC" }
> = {
  recent: { orderBy: "id", orderType: "DESC" },
  "name-asc": { orderBy: "name", orderType: "ASC" },
  "name-desc": { orderBy: "name", orderType: "DESC" },
};

export default function InstructorsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderByValue, setOrderByValue] = useState("recent");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );

  const order = ORDER_MAP[orderByValue] ?? ORDER_MAP.recent;

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    orderBy: order.orderBy,
    orderType: order.orderType,
    search: search || undefined,
    ...(statusFilter && {
      filters: ["isActive"],
      filtersValues: [statusFilter],
    }),
  };

  const { data, isLoading, isPlaceholderData } = useInstructorsQuery(params);
  const deleteMutation = useDeleteInstructorMutation();

  const instructors = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  function handleOpenCreate() {
    setEditingInstructor(null);
    setModalOpen(true);
  }

  function handleOpenEdit(instructor: Instructor) {
    setEditingInstructor(instructor);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingInstructor(null);
  }

  function handleDelete(instructor: Instructor) {
    confirm({
      intent: "danger",
      title: "Eliminar profesor",
      description: `¿Estas seguro que deseas eliminar a ${instructor.name} ${instructor.lastname}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate(
          { id: instructor.id },
          {
            onSuccess: () =>
              toast.info("", {
                description:
                  "La baja de profesores aun no esta implementada en el servidor.",
              }),
          },
        );
      },
    });
  }

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleOrderByChange = useCallback((value: string) => {
    setOrderByValue(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Profesores</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Administra los profesores del gimnasio
          </p>
        </div>
        <Button intent="primary" onClick={handleOpenCreate}>
          <Plus size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Crear profesor</span>
        </Button>
      </div>

      <InstructorsFilters
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        orderByValue={orderByValue}
        onOrderByChange={handleOrderByChange}
      />

      <InstructorsTable
        data={instructors}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <InstructorFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        instructor={editingInstructor ?? undefined}
      />
    </div>
  );
}
