import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documento } from '../entity/Documento';
import { Observable } from 'rxjs';
import { UtenteService } from './utente.service';
import { user } from '../entity/user';
import { Utente } from '../entity/Utente';
@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  
  URL : string = 'https://backed-sdcc.azurewebsites.net/documenti';
  constructor(private http: HttpClient, private utenteService:UtenteService) { }


  public async mostraDocumenti(): Promise<Observable<Documento[]>> {
    let utente:string = await this.utenteService.getUtente();
    return this.http.get<Documento[]>(this.URL+"?utente="+utente);
  }

  public aggiungiDocumento(documento: Documento): Observable<Object>{
    return this.http.post<Documento>(this.URL+"/aggiungi",documento);
  }

  public async deleteDocumento(id: string):Promise<Observable<Object>>{
    let utente:string = await this.utenteService.getUtente();
    return this.http.delete(this.URL + "/rimuovi?id="+id+"&utente="+utente);
  }

  public ricercaConFiltri(tag: string, anno:number, importo:number, utente:string): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.URL+"/cerca?tag="+tag+"&anno="+anno+"&importo="+importo+"&utente="+utente);
  }

  public spesePerAnno(arg0: number, arg1: number,utente:string): Observable<number[]> {
    return this.http.get<number[]>(this.URL + "/spesePerAnno?annoI=" + arg0 + "&annoF=" + arg1+"&utente="+utente);
  }

  public spesePerCategoria(arg0: string[],utente:string): Observable<number[]> {
    const params = arg0.map(value => `tag=${encodeURIComponent(value)}`).join('&');
    const url = this.URL+`/spesePerCategoria?${params}`+"&utente="+utente;
    return this.http.get<number[]>(url);
  }

  public spesePerCategoria_Anno(arg0: number, categorie: string[],utente:string) {
    const params = categorie.map(value => `tag=${encodeURIComponent(value)}`).join('&');
    const url = this.URL+'/spesePerCategoria_Anno?anno='+arg0+'&'+`${params}`+"&utente="+utente;
    return this.http.get<number[]>(url);
  }
  
  
}
