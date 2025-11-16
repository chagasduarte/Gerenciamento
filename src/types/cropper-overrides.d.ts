declare module 'cropperjs' {
  interface CropperOptions {
    aspectRatio?: number;
    viewMode?: number;
    dragMode?: 'crop' | 'move' | 'none';
    cropBoxResizable?: boolean;
    cropBoxMovable?: boolean;
    background?: boolean;
    guides?: boolean;
    zoomOnWheel?: boolean;
    ready?: () => void;
  }

  interface Cropper {
    getCroppedCanvas(options?: any): HTMLCanvasElement;

    // Adicione o método zoom aqui
    zoom(ratio: number): void;
    destroy(): void;
    // Se quiser garantir também:
    zoomTo(ratio: number): void;
    move(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    rotate(degree: number): void;
    rotateTo(degree: number): void;
  }
}
