import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utente } from '../entity/Utente';
import { Observable } from 'rxjs';
import { user } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  URL : string = 'https://backed-sdcc.azurewebsites.net/utenti/registra';
  constructor(private http: HttpClient) { }

  public registraUtente(utente: Utente): Observable<Object>{
    return this.http.post<Utente>(this.URL,utente);
  }

  public async getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

  public async getUtente():Promise<string>{
    let userInfo:user = await this.getUserInfo();
    return userInfo.userDetails;
  }

}
