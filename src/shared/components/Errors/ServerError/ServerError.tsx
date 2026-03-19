import { ErrorComponent } from "../ErrorComponent/ErrorComponent";

export function ServerError() {
  return (
    <ErrorComponent
      image="/images/errors/500.png"
      imageAlt="Error del servidor"
      title="Error del servidor"
      description="Ocurrio un error inesperado. Por favor, intenta de nuevo mas tarde."
    />
  );
}

ServerError.displayName = "ServerError";
