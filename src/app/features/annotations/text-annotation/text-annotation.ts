import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TextAnnotation as TextAnnotationModel } from '../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-text-annotation',
  styleUrl: './text-annotation.scss',
  templateUrl: './text-annotation.html',
  host: {
    '(document:mousemove)': 'drag($event)',
    '(document:mouseup)': 'endDrag()',
  },
})
export class TextAnnotation {
  readonly annotation = input.required<TextAnnotationModel>();
  readonly moved = output<{ x: number; y: number }>();
  readonly removed = output<void>();

  private draggedElement: HTMLElement | null = null;
  private grabOffset = { x: 0, y: 0 };

  startDrag(event: MouseEvent): void {
    const isLeftMouseButton = event.button === 0;

    if (!isLeftMouseButton) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    this.draggedElement = element;
    this.grabOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    event.preventDefault();
  }

  drag(event: MouseEvent): void {
    const element = this.draggedElement;

    if (!element) return;

    const page = element.closest<HTMLElement>('.document-viewer__page');

    if (!page) return;

    const pageRect = page.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const maxX = Math.max(0, pageRect.width - elementRect.width);
    const maxY = Math.max(0, pageRect.height - elementRect.height);
    const x = Math.min(maxX, Math.max(0, event.clientX - pageRect.left - this.grabOffset.x));
    const y = Math.min(maxY, Math.max(0, event.clientY - pageRect.top - this.grabOffset.y));
    this.moved.emit({ x: x / pageRect.width, y: y / pageRect.height });
  }

  endDrag(): void {
    this.draggedElement = null;
  }
}
