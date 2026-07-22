import type { ColumnDef } from "@tanstack/react-table";
import { Avatar } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { Fee } from "../../types";
import { getFeeNotes } from "../../lib/feeNotes";
import { FeeDueBadge } from "../common";

export const billingColumns: ColumnDef<Fee, unknown>[] = [
  {
    id: "member",
    header: "Alumno",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { member } = row.original;
      const initials = (
        member.name.charAt(0) + member.lastname.charAt(0)
      ).toUpperCase();
      const fullName = `${member.name} ${member.lastname}`;

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="primary"
            src={member.image ?? null}
            fallback={initials}
            alt={fullName}
          />
          <span className="font-medium">{fullName}</span>
        </div>
      );
    },
  },
  {
    id: "period",
    header: "Período",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <span className="whitespace-nowrap text-sm text-neutral-600">
          {formatDate(startDate)} – {formatDate(endDate)}
        </span>
      );
    },
  },
  {
    id: "dueStatus",
    header: "Vencimiento",
    cell: ({ row }) => <FeeDueBadge fee={row.original} />,
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatCurrency(row.original.totalAmount)}
      </span>
    ),
  },
  {
    id: "paid",
    header: "Pagado",
    cell: ({ row }) => {
      const { amountPaid, totalAmount } = row.original;
      const remaining = totalAmount - amountPaid;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">
            {formatCurrency(amountPaid)}
          </span>
          {remaining > 0 && (
            <span className="text-xs text-neutral-400">
              Resta {formatCurrency(remaining)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "notes",
    header: "Observaciones",
    meta: { className: "max-w-64" },
    cell: ({ row }) => {
      const notes = getFeeNotes(row.original.payments);
      if (notes.length === 0) {
        return (
          <span className="italic text-neutral-400">Sin observaciones</span>
        );
      }

      const lastNote = notes[notes.length - 1];

      return (
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span
            className="line-clamp-2 text-xs text-neutral-600"
            title={lastNote.text}
          >
            {lastNote.text}
          </span>
          {notes.length > 1 && (
            <span className="text-xs font-medium text-info">
              +{notes.length - 1} más
            </span>
          )}
        </div>
      );
    },
  },
];
