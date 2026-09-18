import { Pipe, PipeTransform } from '@angular/core';
import { AnnotationType, DocumentAnnotation, TextAnnotation } from '../../../core/models';

@Pipe({
  name: 'annotationsForPage',
  pure: true,
})
export class AnnotationsForPagePipe implements PipeTransform {
  transform(annotations: DocumentAnnotation[], pageNumber: number): TextAnnotation[] {
    return annotations.filter(
      (annotation) =>
        annotation.pageNumber === pageNumber && annotation.type === AnnotationType.Text,
    );
  }
}
