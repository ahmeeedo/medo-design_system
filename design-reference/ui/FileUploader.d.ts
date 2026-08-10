import type * as React from "react";

export interface UploadedFile {
  id?: string | number;
  name: string;
  size?: number;
  /** `done` fertig, `uploading` mit `progress`, `error` mit `error`. */
  status?: "done" | "uploading" | "error";
  /** 0–100, nur bei `uploading`. */
  progress?: number;
  error?: string;
  /** Bild-URL für die 40px-Vorschau. Ohne sie steht dort ein Dokument-Icon. */
  preview?: string;
  /** Die Originaldatei, wenn sie über die Komponente kam. */
  file?: File;
}

export interface FileUploaderProps {
  /** Die aktuell gezeigte Liste. Die Komponente hält keinen eigenen Zustand. */
  files?: UploadedFile[];
  /** Neue Dateien — bereits gegen `accept` und `maxSize` geprüft. */
  onFilesAdded?: (files: UploadedFile[]) => void;
  /** Gesetzt, bekommt jede Zeile eine Entfernen-Schaltfläche. */
  onRemove?: (file: UploadedFile, index: number) => void;
  label?: React.ReactNode;
  /** Was hochgeladen werden soll — steht über der Fläche. */
  helper?: React.ReactNode;
  /** Wie bei `<input accept>`: ".pdf,.jpg" oder "image/*". */
  accept?: string;
  multiple?: boolean;
  /** Größte erlaubte Dateigröße in Bytes. */
  maxSize?: number;
  disabled?: boolean;
  /** Kompakte Zeile statt Ablagefläche — für genau eine Datei. */
  compact?: boolean;
  buttonText?: string;
  dropText?: string;
  removeLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FileUploader: React.FC<FileUploaderProps>;
