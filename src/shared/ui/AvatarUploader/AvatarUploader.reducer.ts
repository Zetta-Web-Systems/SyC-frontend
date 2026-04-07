import type { CroppedAreaPixels } from "@shared/utils/image.utils";

interface CropState {
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: CroppedAreaPixels | null;
  isModalOpen: boolean;
  error: string | null;
  isProcessing: boolean;
}

type CropAction =
  | { type: "OPEN_MODAL"; imageSrc: string }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_CROP"; crop: { x: number; y: number } }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_CROPPED_AREA"; croppedAreaPixels: CroppedAreaPixels }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }
  | { type: "START_PROCESSING" }
  | { type: "FINISH_PROCESSING" }
  | { type: "RESET" };

export const initialCropState: CropState = {
  imageSrc: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  isModalOpen: false,
  error: null,
  isProcessing: false,
};

export function cropReducer(state: CropState, action: CropAction): CropState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        imageSrc: action.imageSrc,
        isModalOpen: true,
        crop: { x: 0, y: 0 },
        zoom: 1,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        imageSrc: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
      };
    case "SET_CROP":
      return { ...state, crop: action.crop };
    case "SET_ZOOM":
      return { ...state, zoom: action.zoom };
    case "SET_CROPPED_AREA":
      return { ...state, croppedAreaPixels: action.croppedAreaPixels };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "START_PROCESSING":
      return { ...state, isProcessing: true };
    case "FINISH_PROCESSING":
      return { ...state, isProcessing: false };
    case "RESET":
      return { ...state, imageSrc: null, error: null };
  }
}
