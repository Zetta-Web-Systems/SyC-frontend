import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { CalendarDays, FileUser, Pencil, UserCheck, UserX } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@shared/ui";
import type { ViewMode } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { MEMBER_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { Member } from "../../types";
import { membersColumns } from "./MembersTable.columns";
import { MemberCard } from "./MemberCard";

interface MembersTableProps {
  data: Member[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  viewMode: ViewMode;
  onProfile: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onRestore: (member: Member) => void;
}

export function MembersTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  viewMode,
  onProfile,
  onEdit,
  onDelete,
  onRestore,
}: MembersTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: MEMBER_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<Member, unknown>[]>(
    () => [
      ...membersColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const member = row.original;

          return (
            <div className="flex place-content-center gap-1">
              {member.isActive ? (
                <>
                  <Button
                    variant="ghost"
                    intent="primary"
                    size="icon"
                    aria-label={`Ver perfil de alumno ${member.name} ${member.lastname}`}
                    onClick={() => onProfile(member)}
                  >
                    <FileUser size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    intent="secondary"
                    size="icon"
                    aria-label={`Editar alumno ${member.name} ${member.lastname}`}
                    onClick={() => onEdit(member)}
                  >
                    <Pencil size={16} aria-hidden="true" color="green" />
                  </Button>
                  <Link
                    to="/attendances"
                    search={{
                      type: "MEMBER" as const,
                      personId: member.personId,
                      personName: `${member.name} ${member.lastname}`,
                    }}
                  >
                    <Button
                      variant="ghost"
                      intent="secondary"
                      size="icon"
                      aria-label={`Ver asistencias de ${member.name} ${member.lastname}`}
                    >
                      <CalendarDays size={16} aria-hidden="true" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    intent="danger"
                    size="icon"
                    aria-label={`Eliminar alumno ${member.name} ${member.lastname}`}
                    onClick={() => onDelete(member)}
                  >
                    <UserX size={16} aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  intent="secondary"
                  size="icon"
                  aria-label={`Restaurar alumno ${member.name} ${member.lastname}`}
                  onClick={() => onRestore(member)}
                >
                  <UserCheck size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onProfile, onEdit, onDelete, onRestore],
  );

  const handlePageIndexChange = useCallback(
    (pageIndex: number) => {
      onPaginationChange((prev) => ({ ...prev, pageIndex }));
    },
    [onPaginationChange],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      onPaginationChange({ pageIndex: 0, pageSize });
    },
    [onPaginationChange],
  );

  const cardList = (
    <>
      <DataCardList
        data={data}
        isLoading={isLoading}
        noResultsMessage="No se encontraron alumnos."
        className="flex-row flex-wrap justify-center"
        renderCard={(member) => (
          <div key={member.id} className="w-full sm:w-80">
            <MemberCard
              member={member}
              onProfile={onProfile}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </div>
        )}
      />
      <StandalonePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={rowCount}
        onPageIndexChange={handlePageIndexChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop */}
      <div className="hidden md:block">
        {viewMode === "table" ? (
          <DataTable
            columns={columns}
            data={data}
            rowCount={rowCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isLoading={isLoading}
            noResultsMessage="No se encontraron alumnos."
            showPagination={true}
            renderPagination={(table) => <DataTablePagination table={table} />}
          />
        ) : (
          cardList
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">{cardList}</div>
    </div>
  );
}

MembersTable.displayName = "MembersTable";
