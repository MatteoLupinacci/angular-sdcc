export class Documento{
    id !: string;
    descrizione !: string;
    importo !: number;
    anno !: number;
    tag !: string;

    constructor(id:string,descrizione:string,importo:number,anno:number,tag:string){
        this.id = id;
        this.descrizione = descrizione;
        this.importo = importo;
        this.anno = anno;
        this.tag = tag;        
    }
    
}