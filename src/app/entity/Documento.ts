import { Utente } from "./Utente";

export class Documento{
    id !: string;
    utente !:Utente;
    descrizione !: string;
    importo !: number;
    anno !: number;
    tag !: string;

    constructor(id:string,utente:Utente,descrizione:string,importo:number,anno:number,tag:string){
        this.id = id;
        this.utente = utente;
        this.descrizione = descrizione;
        this.importo = importo;
        this.anno = anno;
        this.tag = tag;        
    }
    
}