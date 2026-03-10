function SyCApp() {
  const navItems = ["Dashboard", "Alumnos", "Ejercicios", "Configuración"];

  return (
    <div className="flex h-screen w-full bg-neutral-100 text-neutral-900 font-sans overflow-hidden">
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
              className={`flex items-center h-11 px-4 rounded-xl font-medium text-sm ${
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
      <main className="flex-1 p-10 overflow-y-auto space-y-10">
        {/* Colores */}
        <section>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
            Colores
          </p>
          <div className="flex gap-3">
            {[
              { label: "Primary", cls: "bg-primary-500" },
              { label: "Secondary", cls: "bg-secondary-500" },
              { label: "Success", cls: "bg-success" },
              { label: "Error", cls: "bg-error" },
              { label: "Warning", cls: "bg-warning" },
              { label: "Info", cls: "bg-info" },
            ].map((color) => (
              <div
                key={color.label}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-xl ${color.cls}`} />
                <span className="text-xs text-neutral-500">{color.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografía */}
        <section>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
            Tipografía
          </p>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold tracking-tighter">
              Sano & Controlado
            </p>
            <p className="text-2xl font-bold tracking-tight">
              Gestionar alumnos
            </p>
            <p className="text-lg font-semibold">Agregar ejercicio</p>
            <p className="text-base font-medium text-neutral-600">
              Texto de cuerpo normal con lectura cómoda.
            </p>
            <p className="text-sm text-neutral-400">
              Texto secundario / metadata
            </p>
          </div>
        </section>

        {/* Botones */}
        <section>
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">
            Botones
          </p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-semibold text-sm hover:bg-primary-600">
              Primario
            </button>
            <button className="px-5 py-2.5 bg-secondary-500 text-white rounded-xl font-semibold text-sm hover:bg-secondary-600">
              Secundario
            </button>
            <button className="px-5 py-2.5 bg-neutral-200 text-neutral-800 rounded-xl font-medium text-sm hover:bg-neutral-300">
              Cancelar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SyCApp;
