import { useState, useRef, useCallback, forwardRef } from "react";
import type { ChangeEvent } from "react";
import Cropper from "react-easy-crop";
import { ImagePlus, X, ZoomIn, Loader2 } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui/Button/Button";
import { Modal } from "@shared/ui/Modal/Modal";
import { Portal } from "@shared/ui/Portal/Portal";
import {
  readFileAsUrl,
  getCroppedImg,
  validateImageFile,
  type CroppedAreaPixels,
} from "@shared/utils/image.utils";

export interface AvatarUploaderProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  initialPreview?: string | null;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export const AvatarUploader = forwardRef<HTMLDivElement, AvatarUploaderProps>(
  ({ onChange, value, initialPreview, maxSizeMB = 5, className, disabled }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] =
      useState<CroppedAreaPixels | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        const validationError = validateImageFile(file, maxSizeMB);
        if (validationError) {
          setError(validationError);
          return;
        }

        try {
          const url = await readFileAsUrl(file);
          setImageSrc(url);
          setIsModalOpen(true);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
        } catch {
          setError("Error al leer la imagen");
        }

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
      [maxSizeMB],
    );

    const handleCropComplete = useCallback(
      (_croppedArea: unknown, croppedAreaPixelsArg: CroppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixelsArg);
      },
      [],
    );

    const handleConfirm = useCallback(async () => {
      if (!imageSrc || !croppedAreaPixels) return;

      setIsProcessing(true);
      try {
        const croppedFile = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          256,
          0.8,
        );
        onChange(croppedFile);
        setIsModalOpen(false);
        setImageSrc(null);
      } catch {
        setError("Error al procesar la imagen");
      } finally {
        setIsProcessing(false);
      }
    }, [imageSrc, croppedAreaPixels, onChange]);

    const handleCancel = useCallback(() => {
      setIsModalOpen(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }, []);

    const handleReset = useCallback(() => {
      onChange(null);
      setImageSrc(null);
      setError(null);
    }, [onChange]);

    const openFilePicker = useCallback(() => {
      inputRef.current?.click();
    }, []);

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)}>
        <Portal>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </Portal>

        {value || initialPreview ? (
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-200">
              <img
                src={value ? URL.createObjectURL(value) : initialPreview ?? undefined}
                alt="Avatar seleccionado"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFilePicker}
                disabled={disabled || isProcessing}
              >
                Cambiar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={disabled || isProcessing}
              >
                <X size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled}
            className={cn(
              "flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-neutral-300",
              "transition-colors hover:border-primary-500 hover:bg-primary-50",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
            )}
            aria-label="Subir imagen de perfil"
          >
            <ImagePlus size={24} className="text-neutral-400" />
            <span className="mt-1 text-xs text-neutral-500">Subir</span>
          </button>
        )}

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <Modal open={isModalOpen} onClose={handleCancel} size="md">
          <div className="flex flex-col gap-4 p-2">
            <h3 className="text-center text-lg font-semibold text-neutral-900">
              Recortar imagen
            </h3>

            <div className="relative h-72 w-full overflow-hidden rounded-lg bg-neutral-100">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ZoomIn size={18} className="text-neutral-500" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-primary-500"
                  aria-label="Zoom"
                />
                <span className="min-w-[3ch] text-sm text-neutral-600">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                intent="primary"
                className="flex-1"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Procesando...
                  </>
                ) : (
                  "Confirmar"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
);

AvatarUploader.displayName = "AvatarUploader";
