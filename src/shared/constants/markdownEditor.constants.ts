export const ME_HEADING_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Párrafo" },
  { value: "1", label: "Título 1" },
  { value: "2", label: "Título 2" },
  { value: "3", label: "Título 3" },
  { value: "4", label: "Título 4" },
  { value: "5", label: "Título 5" },
  { value: "6", label: "Título 6" },
];

export const ME_SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Ctrl/Cmd + B", action: "Negrita" },
  { keys: "Ctrl/Cmd + I", action: "Cursiva" },
  { keys: "Ctrl/Cmd + U", action: "Subrayado" },
  { keys: "Ctrl/Cmd + Shift + S", action: "Tachado" },
  { keys: "Ctrl/Cmd + Z", action: "Deshacer" },
  { keys: "Ctrl/Cmd + Shift + Z", action: "Rehacer" },
  { keys: "Ctrl/Cmd + [", action: "Disminuir sangría" },
  { keys: "Ctrl/Cmd + ]", action: "Aumentar sangría" },
  { keys: "Ctrl/Cmd + Shift + 7", action: "Lista numerada" },
  { keys: "Ctrl/Cmd + Shift + 8", action: "Lista con viñetas" },
  { keys: "Ctrl/Cmd + Shift + 9", action: "Lista de tareas" },
  { keys: "Ctrl/Cmd + Shift + L", action: "Alinear a la izquierda" },
  { keys: "Ctrl/Cmd + Shift + E", action: "Centrar" },
  { keys: "Ctrl/Cmd + Shift + R", action: "Alinear a la derecha" },
  { keys: "Ctrl/Cmd + Shift + J", action: "Justificar" },
  { keys: "Ctrl/Cmd + K", action: "Insertar enlace" },
];

export const ME_POPOVER = {
  MAX_WIDTH: 288,
  GAP: 4,
  VP_MARGIN: 8,
};

const ME_CONTENT_BASE_CLASSNAME = [
  "[&_.ProseMirror]:outline-none",
  "[&_.ProseMirror_p]:my-1",
  "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5",
  "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5",
  "[&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:pl-0",
  "[&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2",
  "[&_.ProseMirror_ul[data-type=taskList]_li_>_label]:mt-1",
  "[&_.ProseMirror_strong]:font-semibold",
  "[&_.ProseMirror_em]:italic",
  "[&_.ProseMirror_s]:line-through",
  "[&_.ProseMirror_u]:underline",
  "[&_.ProseMirror_mark]:bg-yellow-200 [&_.ProseMirror_mark]:rounded-sm [&_.ProseMirror_mark]:px-0.5",
  "[&_.ProseMirror_a]:text-primary-600 [&_.ProseMirror_a]:underline",
  "[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:my-2",
].join(" ");

const ME_CONTENT_HEADINGS_DEFAULT = [
  "[&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2",
  "[&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-1",
  "[&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1",
  "[&_.ProseMirror_h4]:text-base [&_.ProseMirror_h4]:font-semibold",
  "[&_.ProseMirror_h5]:text-sm [&_.ProseMirror_h5]:font-semibold",
  "[&_.ProseMirror_h6]:text-xs [&_.ProseMirror_h6]:font-semibold [&_.ProseMirror_h6]:uppercase",
].join(" ");

const ME_CONTENT_HEADINGS_COMPACT = [
  "[&_.ProseMirror_h1]:text-base [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h1]:mt-2 [&_.ProseMirror_h1]:mb-1",
  "[&_.ProseMirror_h2]:text-sm [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-2 [&_.ProseMirror_h2]:mb-1",
  "[&_.ProseMirror_h3]:text-sm [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-1 [&_.ProseMirror_h3]:mb-0.5",
  "[&_.ProseMirror_h4]:text-xs [&_.ProseMirror_h4]:font-semibold",
  "[&_.ProseMirror_h5]:text-xs [&_.ProseMirror_h5]:font-medium",
  "[&_.ProseMirror_h6]:text-[10px] [&_.ProseMirror_h6]:font-semibold [&_.ProseMirror_h6]:uppercase",
].join(" ");

export const ME_CONTENT_CLASSNAME = `${ME_CONTENT_BASE_CLASSNAME} ${ME_CONTENT_HEADINGS_DEFAULT}`;

export const ME_CONTENT_CLASSNAME_COMPACT = `${ME_CONTENT_BASE_CLASSNAME} ${ME_CONTENT_HEADINGS_COMPACT}`;
