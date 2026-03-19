import { ErrorComponent } from "../ErrorComponent/ErrorComponent";

export function Forbidden() {
  return (
    <ErrorComponent
      image="/images/errors/403.png"
      imageAlt="Acceso denegado"
      title="Acceso denegado"
      description="No tenes permisos para acceder a esta seccion."
    />
  );
}

Forbidden.displayName = "Forbidden";
