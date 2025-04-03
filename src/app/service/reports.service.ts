import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { registro } from '../types/models.type';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private user: any

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.user = this.authService.getUserFromToken()
  }

  private apiUrl = `${environment.apiUrl}/reports`


  createReport(pacientesId: number, reportData: any, files: File[], user: any) {

    const formData = new FormData();

    for (const key in reportData) {
      formData.append(key, reportData[key])
    }

    formData.append('user', JSON.stringify(user))

    for (const file of files) {
      const sanitizedFileName = file.name.replace(/\s+/g, '-');
      formData.append('files', file, sanitizedFileName)
    }
    console.log(formData)
    return this.http.post(`${this.apiUrl}/${pacientesId}`, formData);
  }

  getReports(): Observable<registro[]> {
    return this.http.get<registro[]>(`${this.apiUrl}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Pega um report específico pelo ID
  getReportById(id: number): Observable<registro> {
    return this.http.get<registro>(`${this.apiUrl}/${id}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteReportId(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteReportMultiple(ids: number[]) {
    console.log(ids)

    return this.http.request('DELETE', `${this.apiUrl}?userId=${this.user.id}`, {
      body: { ids }, // Aqui enviamos os IDs no corpo da requisição
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateReport(dadosUpdate: any): Observable<registro> {
    console.log(dadosUpdate)
    console.log(this.user.id)
    return this.http.put<registro>(this.apiUrl, {
      updateData: dadosUpdate,
      userId: this.user.id
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
