import { useState } from "react";
import { z } from "zod";
import { Plus, ChevronDown, Trash2, Search, Eye } from "lucide-react";
import { Button } from "@shared/ui/Button/Button";
import { Checkbox } from "@shared/ui/Checkbox/Checkbox";
import { Input } from "@shared/ui/Input/Input";
import { Label } from "@shared/ui/Label/Label";
import { Select } from "@shared/ui/Select/Select";
import { Textarea } from "@shared/ui/Textarea/Textarea";
import { SearchInput } from "@shared/ui/SearchInput/SearchInput";
import { Form, FormField, FormFieldArray } from "@shared/components/Form";
import { ColorScale } from "@shared/docs/components/ColorScale";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.email("Ingresá un correo electrónico válido"),
  plan: z.string().min(1, "Seleccioná un plan"),
  notes: z.string().max(200, "Máximo 200 caracteres").optional(),
  terms: z.literal(true, { error: "Debés aceptar los términos" }),
});
type ContactSchema = z.infer<typeof contactSchema>;

const phonesSchema = z.object({
  phones: z
    .array(
      z.object({
        number: z.string().min(1, "El teléfono es obligatorio"),
      }),
    )
    .min(1, "Agregá al menos un teléfono"),
});
type PhonesSchema = z.infer<typeof phonesSchema>;

const SectionLabel = ({ children }: { children: string }) => (
  <p className="border-l-2 border-primary-500 pl-3 font-mono text-xs uppercase tracking-widest text-neutral-400">
    {children}
  </p>
);

const SubLabel = ({ children }: { children: string }) => (
  <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
    {children}
  </p>
);

const GroupHeading = ({ children }: { children: string }) => (
  <h3 className="text-sm font-semibold text-neutral-800">{children}</h3>
);

const MOCK_ALUMNOS = [
  "Ana García",
  "Carlos López",
  "María Fernández",
  "Juan Martínez",
  "Laura Rodríguez",
  "Diego Sánchez",
  "Sofía Gómez",
  "Matías Pérez",
];

function SearchInputDemo() {
  const [filter, setFilter] = useState("");
  const results = MOCK_ALUMNOS.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <SearchInput placeholder="Buscar alumno..." onSearch={setFilter} />
      <p className="text-xs text-neutral-500">
        {filter
          ? `${results.length} resultado${results.length !== 1 ? "s" : ""} para "${filter}"`
          : `${MOCK_ALUMNOS.length} alumnos`}
      </p>
       {filter && results.length > 0 && (
         <ul className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
           {results.map((name) => (
             <li key={name} className="px-4 py-2.5 text-sm text-neutral-700">
               {name}
             </li>
           ))}
         </ul>
       )}
      {filter && results.length === 0 && (
        <p className="text-sm text-neutral-400">Sin resultados.</p>
      )}
    </div>
  );
}

function DesignHubPage() {
  return (
    <div>
      {/* Main */}
      <main className="flex overflow-auto p-10 flex-1">
        <div className="mx-auto max-w-5xl space-y-12 pb-20">
          <header>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Design Hub
            </h2>
            <p className="text-sm text-neutral-500">
              Mostrando decisiones de diseño y componentes de UI base.
            </p>
          </header>

          {/* ── Base ─────────────────────────────────────────────── */}
          <SectionLabel>Base</SectionLabel>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Colores */}
            <section className="space-y-6">
              <SubLabel>Colores</SubLabel>

              <ColorScale
                name="Primary"
                chosen={["#3e4c93", "600"]}
                colors={[
                  "#edeff7",
                  "#cdd2ea",
                  "#acb4dc",
                  "#8c97cf",
                  "#6c7ac1",
                  "#4b5db4",
                  "#3e4c93",
                  "#313c75",
                  "#232b53",
                  "#151a32",
                  "#080912",
                ]}
              />

              <ColorScale
                name="Secondary"
                chosen={["#71bcb5", "500"]}
                colors={[
                  "#eef7f6",
                  "#cee8e6",
                  "#afd9d5",
                  "#90cbc5",
                  "#71bcb5",
                  "#4ea49c",
                  "#438e87",
                  "#346f69",
                  "#26504c",
                  "#17312e",
                  "#081110",
                ]}
              />

              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500">
                  Semánticos
                </p>
                <div className="flex gap-3">
                  {(
                    [
                      ["bg-success", "Success"],
                      ["bg-error", "Error"],
                      ["bg-warning", "Warning"],
                      ["bg-info", "Info"],
                    ] as const
                  ).map(([color, label]) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`h-10 w-10 rounded-lg ${color}`} />
                      <span className="text-[10px] text-neutral-400">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tipografía */}
            <section className="space-y-4">
              <SubLabel>Tipografía</SubLabel>
              <div className="space-y-5">
                {(
                  [
                    ["h1", "Título principal (h1)"],
                    ["h2", "Sección principal (h2)"],
                    ["h3", "Subsección (h3)"],
                    ["h4", "Título de componente (h4)"],
                    ["h5", "Subtítulo menor (h5)"],
                    ["h6", "Etiqueta o metadato (h6)"],
                  ] as const
                ).map(([Tag, text]) => (
                  <Tag key={Tag}>{text}</Tag>
                ))}
              </div>
            </section>
          </div>

          <hr className="border-neutral-200" />

          {/* ── Componentes UI ───────────────────────────────────── */}
          <SectionLabel>Componentes UI</SectionLabel>

          <div className="space-y-16">
            {/* ── Botones ── */}
            <section className="space-y-6">
              <SubLabel>Botones</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Solid (Intents)</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="solid" intent="primary">
                    Primario
                  </Button>
                  <Button variant="solid" intent="secondary">
                    Secundario
                  </Button>
                  <Button variant="solid" intent="danger">
                    Eliminar
                  </Button>
                  <Button variant="solid" intent="neutral">
                    Neutral
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Outline (Intents)</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" intent="primary">
                    Primario
                  </Button>
                  <Button variant="outline" intent="secondary">
                    Secundario
                  </Button>
                  <Button variant="outline" intent="danger">
                    Eliminar
                  </Button>
                  <Button variant="outline" intent="neutral">
                    Neutral
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Ghost (Intents)</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="ghost" intent="primary">
                    Primario
                  </Button>
                  <Button variant="ghost" intent="secondary">
                    Secundario
                  </Button>
                  <Button variant="ghost" intent="danger">
                    Eliminar
                  </Button>
                  <Button variant="ghost" intent="neutral">
                    Neutral
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Tamaños</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Con icono</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button intent="primary">
                    <Plus size={16} aria-hidden="true" />
                    Agregar
                  </Button>
                  <Button variant="outline" intent="neutral">
                    Opciones
                    <ChevronDown size={16} aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" intent="danger" size="icon">
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Estados</GroupHeading>
                <div className="flex flex-wrap items-center gap-3">
                  <Button intent="primary" disabled>
                    Deshabilitado
                  </Button>
                  <Button intent="secondary" isLoading>
                    Guardando
                  </Button>
                  <Button intent="danger" isLoading disabled>
                    Cargando
                  </Button>
                </div>
              </div>
            </section>

            {/* ── Input ── */}
            <section className="space-y-6">
              <SubLabel>Input</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Default</GroupHeading>
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <Label htmlFor="hub-name" required>
                    Nombre completo
                  </Label>
                  <Input id="hub-name" placeholder="Ej: Juan Pérez" />
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Tamaños</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Input size="sm" placeholder="Small (sm)" />
                  <Input size="md" placeholder="Medium (md) — default" />
                  <Input size="lg" placeholder="Large (lg)" />
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Con elementos</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Input
                    placeholder="Buscar alumno..."
                    leftElement={<Search size={16} aria-hidden="true" />}
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    rightElement={<Eye size={16} aria-hidden="true" />}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Estados</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Input placeholder="Deshabilitado" disabled />
                  <Input
                    id="hub-email-error"
                    type="email"
                    defaultValue="correo-invalido"
                    error
                    errorMessage="Ingresá un correo electrónico válido"
                  />
                </div>
              </div>
            </section>

            {/* ── Label ── */}
            <section className="space-y-6">
              <SubLabel>Label</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Variantes</GroupHeading>
                <div className="flex flex-col gap-3">
                  <Label>Label estándar</Label>
                  <Label required>Label requerido</Label>
                </div>
              </div>
            </section>

            {/* ── Textarea ── */}
            <section className="space-y-6">
              <SubLabel>Textarea</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Default</GroupHeading>
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <Label htmlFor="hub-notes" required>
                    Notas
                  </Label>
                  <Textarea
                    id="hub-notes"
                    placeholder="Escribí las observaciones del alumno..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Estados</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Textarea placeholder="Deshabilitado" disabled />
                  <Textarea
                    id="hub-textarea-error"
                    defaultValue="Texto inválido"
                    error
                    errorMessage="Este campo no puede superar los 200 caracteres"
                  />
                </div>
              </div>
            </section>

            {/* ── Checkbox ── */}
            <section className="space-y-6">
              <SubLabel>Checkbox</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Estados</GroupHeading>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="hub-cb-default" />
                    <Label htmlFor="hub-cb-default">Sin marcar</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="hub-cb-checked" defaultChecked />
                    <Label htmlFor="hub-cb-checked">Marcado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="hub-cb-disabled" disabled />
                    <Label htmlFor="hub-cb-disabled">Deshabilitado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hub-cb-disabled-checked"
                      disabled
                      defaultChecked
                    />
                    <Label htmlFor="hub-cb-disabled-checked">
                      Deshabilitado marcado
                    </Label>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="hub-cb-error"
                        error
                        errorMessage="Debés aceptar los términos para continuar"
                      />
                      <Label htmlFor="hub-cb-error">
                        Aceptar términos y condiciones
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Select ── */}
            <section className="space-y-6">
              <SubLabel>Select</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Default</GroupHeading>
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <Label htmlFor="hub-plan" required>
                    Plan
                  </Label>
                  <Select id="hub-plan" placeholder="Seleccioná un plan">
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Tamaños</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Select size="sm" placeholder="Small (sm)">
                    <option value="a">Opción A</option>
                  </Select>
                  <Select size="md" placeholder="Medium (md) — default">
                    <option value="a">Opción A</option>
                  </Select>
                  <Select size="lg" placeholder="Large (lg)">
                    <option value="a">Opción A</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <GroupHeading>Estados</GroupHeading>
                <div className="flex flex-col gap-3 max-w-sm">
                  <Select placeholder="Deshabilitado" disabled>
                    <option value="a">Opción A</option>
                  </Select>
                  <Select
                    id="hub-select-error"
                    error
                    errorMessage="Seleccioná una opción válida"
                    placeholder="Sin selección"
                  >
                    <option value="a">Opción A</option>
                  </Select>
                </div>
              </div>
            </section>
          </div>

          <hr className="border-neutral-200" />

          {/* ── Formularios ──────────────────────────────────────── */}
          <SectionLabel>Formularios</SectionLabel>

          <div className="space-y-16">
            {/* ── Form + FormField ── */}
            <section className="space-y-6">
              <SubLabel>Form + FormField</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Formulario con validación (Zod)</GroupHeading>
                <p className="text-xs text-neutral-500">
                  Presioná &quot;Enviar&quot; vacío para ver los errores de
                  validación.
                </p>

                <Form<ContactSchema>
                  schema={contactSchema}
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                  className="flex max-w-sm flex-col gap-4"
                >
                  <FormField<ContactSchema>
                    name="name"
                    label="Nombre completo"
                    required
                  >
                    {(field) => (
                      <Input {...field} placeholder="Ej: Juan Pérez" />
                    )}
                  </FormField>

                  <FormField<ContactSchema>
                    name="email"
                    label="Correo electrónico"
                    required
                  >
                    {(field) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="tu@email.com"
                      />
                    )}
                  </FormField>

                  <FormField<ContactSchema> name="plan" label="Plan" required>
                    {(field) => (
                      <Select {...field} placeholder="Seleccioná un plan">
                        <option value="mensual">Mensual</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="anual">Anual</option>
                      </Select>
                    )}
                  </FormField>

                  <FormField<ContactSchema> name="notes" label="Notas">
                    {(field) => (
                      <Textarea
                        {...field}
                        placeholder="Observaciones opcionales..."
                      />
                    )}
                  </FormField>

                  <FormField<ContactSchema> name="terms">
                    {(field) => (
                      <div className="flex items-center gap-2">
                        <Checkbox {...field} />
                        <Label htmlFor={field.id}>
                          Acepto los términos y condiciones
                        </Label>
                      </div>
                    )}
                  </FormField>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit">Enviar</Button>
                    <Button type="reset" variant="outline" intent="neutral">
                      Limpiar
                    </Button>
                  </div>
                </Form>
              </div>
            </section>

            {/* ── Form con render prop ── */}
            <section className="space-y-6">
              <SubLabel>Render Prop</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Acceso al estado del formulario</GroupHeading>
                <p className="text-xs text-neutral-500">
                  Usando children como función para acceder a isDirty e
                  isSubmitting.
                </p>

                <Form<ContactSchema>
                  schema={contactSchema}
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                  className="flex max-w-sm flex-col gap-4"
                >
                  {(form) => (
                    <>
                      <FormField<ContactSchema>
                        name="name"
                        label="Nombre"
                        required
                      >
                        {(field) => (
                          <Input {...field} placeholder="Ej: María López" />
                        )}
                      </FormField>

                      <FormField<ContactSchema>
                        name="email"
                        label="Email"
                        required
                      >
                        {(field) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="tu@email.com"
                          />
                        )}
                      </FormField>

                      <FormField<ContactSchema>
                        name="plan"
                        label="Plan"
                        required
                      >
                        {(field) => (
                          <Select {...field} placeholder="Seleccioná un plan">
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="anual">Anual</option>
                          </Select>
                        )}
                      </FormField>

                      <FormField<ContactSchema> name="terms">
                        {(field) => (
                          <div className="flex items-center gap-2">
                            <Checkbox {...field} />
                            <Label htmlFor={field.id}>
                              Acepto los términos
                            </Label>
                          </div>
                        )}
                      </FormField>

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          type="submit"
                          isLoading={form.formState.isSubmitting}
                        >
                          Guardar
                        </Button>
                        <span className="text-xs text-neutral-400">
                          {form.formState.isDirty
                            ? "Cambios sin guardar"
                            : "Sin cambios"}
                        </span>
                      </div>
                    </>
                  )}
                </Form>
              </div>
            </section>

            {/* ── FormFieldArray ── */}
            <section className="space-y-6">
              <SubLabel>FormFieldArray</SubLabel>

              <div className="space-y-3">
                <GroupHeading>
                  Lista dinámica de campos (useFieldArray)
                </GroupHeading>
                <p className="text-xs text-neutral-500">
                  Usá el botón &quot;Agregar&quot; para añadir filas y la
                  &quot;x&quot; para eliminarlas. Presioná &quot;Guardar&quot;
                  vacío para ver las validaciones.
                </p>

                <Form<PhonesSchema>
                  schema={phonesSchema}
                  defaultValues={{ phones: [{ number: "" }] }}
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                  className="flex max-w-sm flex-col gap-4"
                >
                  <FormFieldArray<PhonesSchema> name="phones">
                    {({ fields, append, remove }) => (
                      <div className="flex flex-col gap-3">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-start gap-2"
                          >
                            <FormField<PhonesSchema>
                              name={`phones.${index}.number`}
                              label={index === 0 ? "Teléfonos" : undefined}
                              required={index === 0}
                              className="flex-1"
                            >
                              {(fp) => (
                                <Input
                                  {...fp}
                                  type="tel"
                                  placeholder="Ej: 11 1234-5678"
                                />
                              )}
                            </FormField>

                            <Button
                              type="button"
                              variant="ghost"
                              intent="danger"
                              size="icon"
                              aria-label="Eliminar teléfono"
                              disabled={fields.length === 1}
                              className={index === 0 ? "mt-5.5" : undefined}
                              onClick={() => remove(index)}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          intent="neutral"
                          size="sm"
                          onClick={() => append({ number: "" })}
                        >
                          <Plus size={14} aria-hidden="true" />
                          Agregar teléfono
                        </Button>
                      </div>
                    )}
                  </FormFieldArray>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit">Guardar</Button>
                  </div>
                </Form>
              </div>
            </section>

            {/* ── SearchInput ── */}
            <section className="space-y-6">
              <SubLabel>SearchInput</SubLabel>

              <div className="space-y-3">
                <GroupHeading>Búsqueda con debounce (300 ms)</GroupHeading>
                <p className="text-xs text-neutral-500">
                  El valor de búsqueda se actualiza 300 ms después de que dejás
                  de escribir.
                </p>

                <SearchInputDemo />
              </div>

              <div className="space-y-3">
                <GroupHeading>Deshabilitado</GroupHeading>
                <div className="max-w-sm">
                  <SearchInput
                    onSearch={() => undefined}
                    disabled
                    placeholder="Buscar alumno..."
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DesignHubPage;
