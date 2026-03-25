import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { confirm } from "@shared/stores/confirm.store";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import { toApiPage } from "@shared/utils/pagination.utils";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { InstructorsTable } from "./components/InstructorsTable/InstructorsTable";
import { InstructorFormModal } from "./components/InstructorFormModal/InstructorFormModal";
import { InstructorsFilters } from "./components/InstructorsFilters/InstructorsFilters";
import { useInstructorsQuery } from "./hooks/useInstructorsQuery";
import { useRegisterInstructorMutation } from "./hooks/mutations/useRegisterInstructorMutation";
import { useUpdateInstructorMutation } from "./hooks/mutations/useUpdateInstructorMutation";
import { useDeleteInstructorMutation } from "./hooks/mutations/useDeleteInstructorMutation";
import { useRestoreInstructorMutation } from "./hooks/mutations/useRestoreInstructorMutation";
import type {
  RegisterInstructorSchema,
  UpdateInstructorSchema,
} from "./schemas/instructor.schema";
import { ORDER_MAP } from "./constants/instructors.constants";
import type { Instructor } from "./types";

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
  const registerMutation = useRegisterInstructorMutation();
  const updateMutation = useUpdateInstructorMutation();
  const deleteMutation = useDeleteInstructorMutation();
  const restoreMutation = useRestoreInstructorMutation();

  const instructors = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  function handleOpenRegister() {
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
    registerMutation.reset();
    updateMutation.reset();
  }

  function handleRegister(data: RegisterInstructorSchema) {
    registerMutation.mutate(data, {
      onSuccess: () => handleCloseModal(),
    });
  }

  function handleUpdate(data: UpdateInstructorSchema) {
    if (!editingInstructor) return;
    confirm({
      intent: "warning",
      title: "Modificar profesor",
      description: `¿Estas seguro que deseas modificar a ${data.name} ${data.lastname}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        updateMutation.mutate(
          { id: editingInstructor.id, dto: data },
          { onSuccess: () => handleCloseModal() },
        );
      },
    });
  }

  function handleDelete(instructor: Instructor) {
    confirm({
      intent: "danger",
      title: "Eliminar profesor",
      description: `¿Estas seguro que deseas eliminar a ${instructor.name} ${instructor.lastname}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: instructor.id });
      },
    });
  }

  function handleRestore(instructor: Instructor) {
    confirm({
      intent: "warning",
      title: "Restaurar profesor",
      description: `¿Estas seguro que deseas restaurar a ${instructor.name} ${instructor.lastname}?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: instructor.id });
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

  const activeMutation = editingInstructor ? updateMutation : registerMutation;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Profesores</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Administra los profesores del gimnasio
          </p>
        </div>
        <Button intent="primary" onClick={handleOpenRegister}>
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
        onRestore={handleRestore}
      />

      {editingInstructor ? (
        <InstructorFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          instructor={editingInstructor}
          onSubmit={handleUpdate}
          isPending={activeMutation.isPending}
          mutation={activeMutation}
        />
      ) : (
        <InstructorFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleRegister}
          isPending={activeMutation.isPending}
          mutation={activeMutation}
        />
      )}
    </div>
  );
}
