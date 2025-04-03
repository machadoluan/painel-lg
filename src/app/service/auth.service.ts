import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/auth`


  login(dadosLogin: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, dadosLogin)
  }

  register(dadosRegistro: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/register`, dadosRegistro)
  }

  isAuthenticado(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any | null {
    const token = this.getToken();
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      return decodedPayload;
    }
    return null;
  }


  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  verifyToken(token: string){
    return this.http.post(`${this.apiUrl}/verify-token`, { token });
  }
}
