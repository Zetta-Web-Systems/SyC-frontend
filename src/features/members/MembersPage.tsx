import { ViewToggle } from "@shared/ui";
import { MembersHeader } from "./components/MembersList/MembersHeader/MembersHeader";
import { MembersTable } from "./components/MembersList/MembersTable";
import { MemberFormModal } from "./components/MembersList/MemberFormModal/MemberFormModal";
import { MembersFilters } from "./components/MembersList/MembersFilters/MembersFilters";
import { useMembersQuery } from "./hooks/useMembersQuery";
import { useMembersFilters } from "./hooks/useMembersFilters";
import { useMembersActions } from "./hooks/useMembersActions";

export default function MembersPage() {
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
  } = useMembersFilters();

  const { data, isLoading, isPlaceholderData } = useMembersQuery(params);

  const {
    modalOpen,
    editingMember,
    isPending,
    activeMutation,
    handleOpenRegister,
    handleOpenEdit,
    handleCloseModal,
    handleRegister,
    handleUpdate,
    handleDelete,
    handleRestore,
  } = useMembersActions();

  const members = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <MembersHeader onCreate={handleOpenRegister} />

      <MembersFilters
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        actions={
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        }
      />

      <MembersTable
        data={members}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        viewMode={viewMode}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {editingMember ? (
        <MemberFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          member={editingMember}
          onSubmit={handleUpdate}
          isPending={isPending}
          mutation={activeMutation}
        />
      ) : (
        <MemberFormModal
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
