import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  input,
  viewChild,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-annotation-editor',
  styleUrl: './annotation-editor.scss',
  templateUrl: './annotation-editor.html',
})
export class AnnotationEditor {
  readonly position = input.required<{ x: number; y: number }>();
  readonly submitted = output<string>();
  readonly canceled = output<void>();

  readonly text = signal('');
  private readonly draftInput = viewChild<ElementRef<HTMLInputElement>>('draftInput');

  constructor() {
    afterNextRender(() => this.draftInput()?.nativeElement.focus());
  }

  updateText(event: Event): void {
    this.text.set((event.target as HTMLInputElement).value);
  }

  submit(): void {
    const text = this.text().trim();
    if (text) this.submitted.emit(text);
  }
}
