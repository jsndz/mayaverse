export interface Element {
  id: string;
  imageUrl: string;
  static: boolean;
  width: number;
  height: number;
}

export interface SpaceElement {
  id: string;
  element: Element;
  x: number;
  y: number;
}

export interface SpaceData {
  dimension: string;
  elements: SpaceElement[];
}

interface Position {
  x: number;
  y: number;
}
export interface User {
  id: string;

  name?: string;
  avatar?: string;
  position: Position;
}

export interface CanvasSize {
  width: number;
  height: number;
}
