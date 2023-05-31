import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documento } from '../entity/Documento';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  
  URL : string = 'https://backed-sdcc.azurewebsites.net/documenti';
  constructor(private http: HttpClient) { }


  public mostraDocumenti(): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.URL);
  }

  public ricercaConFiltri(tag: string, anno:number, importo:number): Observable<Documento[]> {
    return this.http.get<Documento[]>(this.URL+"/cerca?tag="+tag+"&anno="+anno+"&importo="+importo);
  }

  public aggiungiDocumento(documento: Documento): Observable<Object>{
    return this.http.post<Documento>(this.URL+"/aggiungi",documento);
  }

  public deleteDocumento(id: string):Observable<Object>{
    return this.http.delete(this.URL + "/rimuovi?id="+id);
  }

  public spesePerAnno(arg0: number, arg1: number): Observable<number[]> {
    return this.http.get<number[]>(this.URL + "/spesePerAnno?annoI=" + arg0 + "&annoF=" + arg1);
  }

  public spesePerCategoria(arg0: string[]): Observable<number[]> {
    const params = arg0.map(value => `tag=${encodeURIComponent(value)}`).join('&');
    const url = this.URL+`/spesePerCategoria?${params}`;
    return this.http.get<number[]>(url);
  }

  public spesePerCategoria_Anno(arg0: number, categorie: string[]) {
    const params = categorie.map(value => `tag=${encodeURIComponent(value)}`).join('&');
    const url = this.URL+'/spesePerCategoria_Anno?anno='+arg0+'&'+`${params}`;
    return this.http.get<number[]>(url);
  }
  
  
}
