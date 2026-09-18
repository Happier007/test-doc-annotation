import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { catchError, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { DocumentApi } from '../../core/api';
import { AnnotationsForPagePipe } from './pipes';
import { AnnotationType, DocumentAnnotation, SavedDocument } from '../../core/models';
import { TextAnnotation, AnnotationEditor } from '../annotations';

@Component({
  selector: 'app-doc-viewer',
  imports: [NgOptimizedImage, AnnotationsForPagePipe, TextAnnotation, AnnotationEditor],
  styleUrl: './document-viewer.scss',
  templateUrl: './document-viewer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewer {
  private readonly route = inject(ActivatedRoute);
  private readonly documentApi = inject(DocumentApi);

  private readonly request = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('documentId') ?? ''),
      distinctUntilChanged(),
      switchMap((id) =>
        this.documentApi.getDocument(id).pipe(
          map((document) => ({ document, error: false })),
          catchError(() => of({ document: null, error: true })),
        ),
      ),
    ),
    { initialValue: { document: null, error: false } },
  );

  readonly document = computed(() => this.request().document);
  readonly hasError = computed(() => this.request().error);
  readonly zoomPercent = signal(100);
  readonly zoom = computed(() => this.zoomPercent() / 100);
  readonly annotations = signal<DocumentAnnotation[]>([]);
  readonly draftAnnotationPosition = signal<{ pageNumber: number; x: number; y: number } | null>(
    null,
  );
  readonly pageWidth = 794;
  readonly pageHeight = 1123;
  readonly draftWidth = 240;
  readonly draftHeight = 72;
  private nextAnnotationId = 0;

  zoomIn(): void {
    this.zoomPercent.update((value) => value + 10);
  }

  zoomOut(): void {
    this.zoomPercent.update((value) => Math.max(10, value - 10));
  }

  save(): void {
    const document = this.document();
    if (!document) return;
    const result: SavedDocument = { ...document, annotations: this.annotations() };
    console.log('Document saved:', result);
  }

  openAnnotationEditor(event: MouseEvent, pageNumber: number): void {
    const page = event.currentTarget as HTMLElement;
    const rect = page.getBoundingClientRect();

    const editorWidth = Math.min(this.draftWidth, rect.width);
    const editorHeight = Math.min(this.draftHeight, rect.height);
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width - editorWidth);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height - editorHeight);

    this.draftAnnotationPosition.set({ pageNumber, x: x / rect.width, y: y / rect.height });
  }

  addTextAnnotation(text: string): void {
    const position = this.draftAnnotationPosition();
    if (!position) return;

    this.annotations.update((items) => [
      ...items,
      {
        id: String(++this.nextAnnotationId),
        type: AnnotationType.Text,
        ...position,
        text,
      },
    ]);

    this.cancelAnnotationEditor();
  }

  moveAnnotation(id: string, position: { x: number; y: number }): void {
    this.annotations.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...position } : item)),
    );
  }

  removeAnnotation(id: string): void {
    this.annotations.update((items) => items.filter((item) => item.id !== id));
  }

  cancelAnnotationEditor(): void {
    this.draftAnnotationPosition.set(null);
  }
}
