import { ErrorComponent } from "../ErrorComponent/ErrorComponent";

export function NotFound() {
  return (
    <ErrorComponent
      image="/images/errors/404.png"
      imageAlt="Pagina no encontrada"
      title="Pagina no encontrada"
      description="La pagina que buscas no existe o fue movida."
    />
  );
}

NotFound.displayName = "NotFound";
