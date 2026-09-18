import { Routes } from '@angular/router';
import { DocumentViewer } from './features';

export const routes: Routes = [
  {path: '', redirectTo: 'documents/1', pathMatch: 'full'},
  {path: 'documents/:documentId', component: DocumentViewer, title: 'Просмотр документа'},
  {path: '**', redirectTo: 'documents/1'},
];
