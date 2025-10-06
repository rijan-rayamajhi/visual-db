// Centralized type definitions for the Visual NoSQL Designer

export interface Collection {
  id: string;
  name: string;
  documents: Document[];
  position: { x: number; y: number };
}

export interface Document {
  id: string;
  name: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  value: string;
  type: string;
  description?: string;
  referenceCollection?: string;
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'map'
  | 'array'
  | 'null'
  | 'timestamp'
  | 'geopoint'
  | 'reference';

export const FIELD_TYPES: FieldType[] = [
  'string',
  'number',
  'boolean',
  'map',
  'array',
  'null',
  'timestamp',
  'geopoint',
  'reference'
];
