import { ViewToggle } from "@shared/ui";
import { InstructorsHeader } from "./components/InstructorsHeader/InstructorsHeader";
import { InstructorsTable } from "./components/InstructorsTable/InstructorsTable";
import { InstructorFormModal } from "./components/InstructorFormModal/InstructorFormModal";
import { InstructorsFilters } from "./components/InstructorsFilters/InstructorsFilters";
import { useInstructorsQuery } from "./hooks/useInstructorsQuery";
import { useInstructorsFilters } from "./hooks/useInstructorsFilters";
import { useInstructorsActions } from "./hooks/useInstructorsActions";

export default function InstructorsPage() {
  const {
    params,
    pagination,
    filters,
    viewMode,
    setViewMode,
    setPagination,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
  } = useInstructorsFilters();

  const { data, isLoading, isPlaceholderData } = useInstructorsQuery(params);

  const {
    modalOpen,
    editingInstructor,
    isPending,
    activeMutation,
    handleOpenRegister,
    handleOpenEdit,
    handleCloseModal,
    handleRegister,
    handleUpdate,
    handleDelete,
    handleRestore,
  } = useInstructorsActions();

  const instructors = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <InstructorsHeader onCreate={handleOpenRegister} />

      <InstructorsFilters
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        actions={
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        }
      />

      <InstructorsTable
        data={instructors}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        viewMode={viewMode}
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
          isPending={isPending}
          mutation={activeMutation}
        />
      ) : (
        <InstructorFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleRegister}
          isPending={isPending}
          mutation={activeMutation}
        />
      )}
    </div>
  );
}
