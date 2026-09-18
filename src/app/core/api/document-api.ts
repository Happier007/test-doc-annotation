import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DocumentData, DocumentResponse } from '../models';


@Injectable({providedIn: 'root'})
export class DocumentApi {
  private readonly http = inject(HttpClient);

  getDocument(documentId: string): Observable<DocumentData> {
    const baseUrl = `/mock/documents/${documentId}`;

    return this.http.get<DocumentResponse>(`${baseUrl}/document.json`).pipe(
      map((document) => ({
        ...document,
        id: documentId,
        pages: document.pages.map((page) => ({...page, imageUrl: `${baseUrl}/${page.imageUrl}`})),
      })),
    )
  }
}