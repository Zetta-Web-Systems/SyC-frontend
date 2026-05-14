import type { ColumnDef } from "@tanstack/react-table";
import { Dumbbell } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { BODY_ZONE_LABELS, GROUP_DOT_CLASS } from "@shared/constants/bodyZones";
import { getAffectedGroups } from "@shared/utils/bodyZones.utils";
import type { Exercise } from "../../types";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
  EXERCISE_LEVEL_TEXT_COLOR_CLASS,
  YOUTUBE_FAVICON_URL,
} from "../../constants";
import { hasYouTubeLink } from "../../utils/linkPreview.utils";

export const exercisesColumns: ColumnDef<Exercise, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name, image, exerciseLevel, links } = row.original;
      const levelIntent = EXERCISE_LEVEL_INTENT[exerciseLevel];
      const hasYoutubeVideo = hasYouTubeLink(links);

      return (
        <div className="flex items-center justify-start gap-4">
          <div className="relative shrink-0">
            <Avatar
              size="md"
              color="neutral"
              src={image ?? null}
              fallback={<Dumbbell size={18} aria-hidden="true" />}
              alt={name}
            />
            {hasYoutubeVideo && (
              <img
                src={YOUTUBE_FAVICON_URL}
                alt="Tiene video de YouTube"
                title="Tiene video de YouTube"
                className="pointer-events-none absolute -top-1 -left-1 z-10 size-4 -rotate-12 drop-shadow-sm"
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">{name}</span>
            <Badge
              variant="dot"
              intent={levelIntent}
              size="md"
              className="text-neutral-800"
            >
              Nivel{" "}
              <span className={EXERCISE_LEVEL_TEXT_COLOR_CLASS[levelIntent]}>
                {EXERCISE_LEVEL_LABELS[exerciseLevel]}
              </span>
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    id: "affectedZones",
    header: "Zonas afectadas",
    cell: ({ row }) => {
      const groups = getAffectedGroups(row.original.affectedZones).filter(
        (g) => g.zones.length > 0,
      );

      if (groups.length === 0) {
        return (
          <span className="flex justify-start text-sm italic text-neutral-400">
            Sin zonas
          </span>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-left text-sm">
          {groups.map((group) => (
            <div key={group.label} className="flex items-center gap-2">
              <span
                className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${GROUP_DOT_CLASS[group.label]}`}
              />
              <span className="shrink-0 font-medium text-neutral-700">
                {group.label}:
              </span>
              <span className="text-neutral-600">
                {group.zones.map((z) => BODY_ZONE_LABELS[z]).join(", ")}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "estado",
    header: "Estado",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge variant="dot" intent={isActive ? "success" : "error"} size="md">
          {isActive ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
];
