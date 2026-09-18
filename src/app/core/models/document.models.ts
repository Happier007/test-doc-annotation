export interface DocumentPage {
  number: number;
  imageUrl: string;
}

export interface DocumentData {
  id: string;
  name: string;
  pages: DocumentPage[];
}

export type DocumentResponse = Omit<DocumentData, 'id'>;

export enum AnnotationType {
  Text = 'text',
}

interface AnnotationBase {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
}

export interface TextAnnotation extends AnnotationBase {
  type: AnnotationType.Text;
  text: string;
}

export type DocumentAnnotation = TextAnnotation;

export interface SavedDocument extends DocumentData {
  annotations: DocumentAnnotation[];
}
