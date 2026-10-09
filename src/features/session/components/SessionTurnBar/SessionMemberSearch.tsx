import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button, Popover, SearchInput } from "@shared/ui";
import { SectionLabel } from "@shared/components/SectionLabel";
import { formatSlotRange } from "@features/schedule";
import {
  ATTENDANCE_STATE_LABELS,
  MEMBER_AVATAR_SIZE,
  SESSION_POSITION_TITLE,
  SESSION_SEARCH_DELAY_MS,
  type SessionPosition,
} from "../../constants";
import { searchSessionMembers } from "../../lib/sessionSearch";
import type { SessionMember, SessionSearchGroup } from "../../types";
import { MemberAvatar } from "../common";

interface SessionMemberSearchProps {
  groups: SessionSearchGroup[];
  onPick: (position: SessionPosition, sessionMember: SessionMember) => void;
}

export function SessionMemberSearch({
  groups,
  onPick,
}: SessionMemberSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchSessionMembers(groups, query);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function pick(position: SessionPosition, sessionMember: SessionMember) {
    close();
    onPick(position, sessionMember);
  }

  return (
    <Popover
      open={open}
      onClose={close}
      side="bottom"
      align="end"
      className="flex w-96 flex-col gap-2 p-2"
      trigger={
        <Button
          variant="outline"
          intent="neutral"
          aria-label="Buscar alumno"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className="h-12 min-w-12 rounded-xl px-3"
        >
          <Search size={20} aria-hidden="true" />
          <span className="hidden xl:inline">Buscar</span>
        </Button>
      }
    >
      <SearchInput
        ref={inputRef}
        placeholder="Buscar alumno"
        delay={SESSION_SEARCH_DELAY_MS}
        onSearch={setQuery}
        className="h-12 text-base"
      />

      {!query.trim() ? (
        <p className="px-2 py-3 text-sm text-neutral-500">
          Busca en el turno en curso, el anterior y el siguiente.
        </p>
      ) : results.length === 0 ? (
        <p className="px-2 py-3 text-sm text-neutral-500">
          Nadie con ese nombre en los turnos de hoy.
        </p>
      ) : (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {results.map((group) => (
            <section key={group.position} className="flex flex-col gap-1">
              <SectionLabel
                title={SESSION_POSITION_TITLE[group.position]}
                trailing={formatSlotRange(
                  group.turn.startTime,
                  group.turn.endTime,
                )}
                className="px-2"
              />
              <ul className="flex flex-col">
                {group.members.map((sessionMember) => {
                  const { member, attendanceState } = sessionMember;
                  return (
                    <li key={member.id}>
                      <button
                        type="button"
                        onClick={() => pick(group.position, sessionMember)}
                        className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-neutral-50 active:bg-neutral-100"
                      >
                        <MemberAvatar
                          member={member}
                          state={attendanceState}
                          size={MEMBER_AVATAR_SIZE.MD}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-neutral-900">
                            {member.name} {member.lastname}
                          </span>
                          <span className="block text-sm text-neutral-500">
                            {ATTENDANCE_STATE_LABELS[attendanceState]}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Popover>
  );
}

SessionMemberSearch.displayName = "SessionMemberSearch";
