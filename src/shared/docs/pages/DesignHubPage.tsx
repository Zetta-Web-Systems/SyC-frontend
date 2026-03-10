import { Button } from "@shared/ui/Button/Button";
import { Card } from "@shared/ui/Card/Card";
import { Input } from "@shared/ui/Input/Input";
import { Label } from "@shared/ui/Label/Label";
import { ColorScale } from "@shared/docs/components/ColorScale";

function DesignHubPage() {
  const navItems = ["Dashboard", "Alumnos", "Ejercicios", "Configuración"];

  return (
    <div className="flex h-screen w-full bg-neutral-100 text-neutral-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-secondary-500 font-bold text-lg">
              S<span className="text-primary-500">C</span>
            </span>
          </div>
          <h1 className="text-lg font-black tracking-tighter text-white">
            S&C Gym
          </h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`flex items-center h-11 px-4 rounded-xl font-medium text-sm transition-colors ${
                i === 0
                  ? "bg-primary-500 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
          <header>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Design Hub
            </h2>
            <p className="text-neutral-500 text-sm">
              Mostrando decisiones de diseño y componentes de UI base.
            </p>
          </header>

          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6 border-l-2 border-primary-500 pl-3">
            Base
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Colores */}
            <section className="space-y-6">
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Colores
              </p>

              <ColorScale
                name="Primary"
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

              {/* Semantic */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500">Semantic</p>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-success" />
                    <span className="text-[10px] text-neutral-400">
                      Success
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-error" />
                    <span className="text-[10px] text-neutral-400">Error</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-warning" />
                    <span className="text-[10px] text-neutral-400">
                      Warning
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-info" />
                    <span className="text-[10px] text-neutral-400">Info</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tipografía */}
            <section>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
                Tipografía
              </p>

              <div className="space-y-6">
                <div>
                  <h1>Título principal de la página (h1)</h1>
                  <p>
                    Encabezado más importante de la página. Representa el tema
                    principal del contenido.
                  </p>
                </div>

                <div>
                  <h2>Sección principal del contenido (h2)</h2>
                  <p>
                    Divide el contenido en secciones importantes dentro de la
                    página.
                  </p>
                </div>

                <div>
                  <h3>Subsección dentro de una sección (h3)</h3>
                  <p>
                    Divide aún más el contenido dentro de una sección definida
                    por un h2.
                  </p>
                </div>

                <div>
                  <h4>Título dentro de un componente o card (h4)</h4>
                  <p>Describir el contenido de cierto componente.</p>
                </div>

                <div>
                  <h5>Subtítulo o título menor (h5)</h5>
                  <p>Subtítulos o agrupaciones de contenido más específicas.</p>
                </div>

                <div>
                  <h6>Etiqueta o metadato (h6)</h6>
                  <p>Información secundaria que requiere menor jerarquía.</p>
                </div>
              </div>
            </section>
          </div>
          <hr className="border-neutral-200" />

          {/* Componentes UI */}
          <div>
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6 border-l-2 border-primary-500 pl-3">
              Componentes UI
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Botones */}
              <section className="space-y-6">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
                  Botones
                </p>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Solid (Intents)
                  </h3>
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
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Outline (Intents)
                  </h3>
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
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Ghost (Intents)
                  </h3>
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

                {/* Tamaños */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Tamaños
                  </h3>
                  <div className="flex flex-wrap justify-start items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* Con Iconos */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Disposiciones con icono
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Icon + Text */}
                    <Button intent="primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                      </svg>
                      Agregar
                    </Button>
                    <Button variant="outline" intent="neutral">
                      Opciones
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </Button>
                    {/* Sólo icono */}
                    <Button variant="ghost" intent="danger" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Estados */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Estados
                  </h3>
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
              {/* Form elements */}
              <section className="space-y-4">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
                  Input + Form
                </p>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-1.5 flex flex-col items-start">
                    <Label
                      className="text-sm font-medium text-neutral-700"
                      htmlFor="email"
                      required
                    >
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-neutral-900 placeholder:text-neutral-400 shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col items-start">
                    <Label
                      className="text-sm font-medium text-neutral-700"
                      htmlFor="password"
                    >
                      Contraseña (Error)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      defaultValue="12345"
                      error
                      errorMessage="La contraseña debe tener al menos 8 caracteres"
                      className="w-full px-4 py-2.5 rounded-xl border border-error bg-error/5 text-sm outline-none focus:border-error focus:ring-4 focus:ring-error/10 transition-all font-medium text-neutral-900 shadow-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Cards */}
              <section className="space-y-4 lg:col-span-full">
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
                  Cards
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900 tracking-tight">
                        Estadísticas
                      </h4>
                      <p className="text-sm text-neutral-500 mt-1">
                        Resumen del mes actual
                      </p>
                    </div>
                    <div className="mt-2 flex items-end gap-3">
                      <span className="text-4xl font-black tracking-tighter text-primary-500">
                        24
                      </span>
                      <span className="text-sm font-medium text-neutral-400 mb-1">
                        nuevos alumnos
                      </span>
                    </div>
                  </Card>

                  <Card className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900 tracking-tight">
                        Suscripción
                      </h4>
                      <p className="text-sm text-neutral-500 mt-1">
                        Plan Pro activo
                      </p>
                    </div>
                    <div className="mt-auto pt-4 flex gap-2">
                      <Button className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl font-medium text-xs hover:bg-neutral-800 transition-colors shadow-sm">
                        Ver plan
                      </Button>
                      <Button className="px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-medium text-xs hover:bg-neutral-200 transition-colors">
                        Cancelar
                      </Button>
                    </div>
                  </Card>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DesignHubPage;
