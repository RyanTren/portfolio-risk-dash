import type { Position } from "../types/position";

export interface Portfolio {
  id: number;
  name: string;
  positions: Position[]; // <- change from ticker/positionCount
  createdAt: string;
}