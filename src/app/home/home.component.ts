import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlobService } from '../services/blob.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatabaseService } from '../services/database.service';
import { Documento } from '../entity/Documento';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChartOptions, ChartType } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { user } from '../entity/user';
import { Utente } from '../entity/Utente';
import { UtenteService } from '../services/utente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  sas: string = "sp=racwdli&st=2023-05-15T21:56:40Z&se=2023-10-01T05:56:40Z&spr=https&sv=2022-11-02&sr=c&sig=lu3kf0SOjckYI7V40HqM4z0Ns0eQ5NxcE8sjx%2FN%2BoaU%3D";
  blob: any;
  user!:user;

  documentForm: FormGroup = new FormGroup({
    file: new FormControl('', Validators.required),
    descrizione: new FormControl('', Validators.required),
    importo: new FormControl('', Validators.required),
    anno: new FormControl('2023', Validators.required),
    tags: new FormControl('', Validators.required)
  });

  categorie: String[] = [" ","Casa","Tasse e Imposte","Spese sanitarie","Spese alimentari","Istruzione","Sport","Trasporti","Altro"];
  annoRic:any = new FormControl("2023",[]);  //approccio model driven
  currentPrz:any = new FormControl("5000",[]);
  currentCat: string = ' ';
  retRicerca: Documento[] = [];
  pageSlice = this.retRicerca.slice(0,6);
  immagini = ["https://static.vecteezy.com/ti/vettori-gratis/t2/20586980-doc-file-formato-documento-colore-icona-vettore-illustrazione-vettoriale.jpg",
              "https://static.vecteezy.com/ti/vettori-gratis/t2/19572895-ricerca-file-pdf-documento-colore-icona-illustrazione-vettoriale.jpg",
              "https://static.vecteezy.com/ti/vettori-gratis/t2/7318804-jpg-file-icona-colore-immagine-digitale-formato-file-isolato-illustrazione-vettoriale.jpg",
              "https://static.vecteezy.com/ti/vettori-gratis/t2/20586482-csv-file-formato-documento-colore-icona-vettore-illustrazione-vettoriale.jpg"
            ];

  barChartLegend = false;
  barChartType: ChartType = 'bar';
  barChartData: any[] = [];
  barChartLabels = ['2019','2020','2021','2022', '2023'];
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spese totali dal 2019 al 2023'
      }
    }
  };

  displayedColumns: any[] = ['id', 'Azioni'];
  dataSource: MatTableDataSource<String>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private blobService: BlobService, private databaseService: DatabaseService, private utenteService:UtenteService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit() {
    this.user = await this.utenteService.getUserInfo();
    this.reloadBlobs();
    //this.speseTotaliPerAnno();
    this.mostraDocumenti();
  }
  
  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const selectedFile: File = files[0];
      this.documentForm.value.file = selectedFile;
      this.blob = selectedFile;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%',
      data: {
        categoria: this.currentCat,
        anno: this.annoRic.value
      },
    });
  }

  reloadBlobs() {
    this.blobService.getBlobsName(this.sas,this.user.userDetails).then(list => {
      this.dataSource.data = list;
    })
  }

  onSubmit() {
    this.uploadBlob();
    this.addEntryDB();
  }

  uploadBlob() {
    let nome = this.documentForm.value.file.substring(12);
    nome = this.user.userDetails+"/"+nome;  //IL NOME è DEL TIPO utente/nomeBlob
    this.blobService.uploadBlob(this.blob, nome, this.sas, () => {
      this.reloadBlobs();
    })
  }

  downloadBlobs(name: string) {
    this.blobService.downloadBlob(name, this.sas, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  deleteBlob(name: string) {
    let i = name.indexOf("/");
    let nome = name.substring(i+1);
    this.deleteEntryDB(nome);
    this.blobService.deleteBlob(this.sas, name, () => {
      this.reloadBlobs();
    })
  }

  async deleteEntryDB(name:string) {
    (await this.databaseService.deleteDocumento(name)).subscribe({
      next: () => {
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addEntryDB() {
    let nome = this.documentForm.value.file.substring(12);
    let documento: Documento = new Documento(nome, new Utente(this.user.userDetails),this.documentForm.value.descrizione, this.documentForm.value.importo, this.documentForm.value.anno, this.documentForm.value.tags);
    this.databaseService.aggiungiDocumento(documento).subscribe({
      next: () => {
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  async speseTotaliPerAnno(): Promise<number[]> {
    let utente = await this.utenteService.getUtente();
    let ret:any[] = [];
    this.databaseService.spesePerAnno(2019, 2023,utente).subscribe({
      next: (res:any[]) => {
        this.barChartData = [
          { data: res,
            backgroundColor: ['green','#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'], // Colori accesi per le barre
            hoverBackgroundColor: ['green','#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'], // Colori accesi per il mouse hover sulle barre
            borderColor: ['green','#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
            borderWidth: 3 
          }
        ];
      },
      error: (err:any) => {
        console.error(err);
      }
    });
    return ret;
  }

  public async mostraDocumenti() {
    (await this.databaseService.mostraDocumenti()).subscribe({
      next: (res) => {
        this.retRicerca = res;
        this.pageSlice = this.retRicerca.slice(0,6);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selezionaImm(nome:string):string{
    const indexPunto = nome.indexOf(".");
    const est = nome.substring(indexPunto+1);
    if(est == "pdf")
      return this.immagini[1];
    if(est == "jpg" || est == "jpeg" || est == "png")
      return this.immagini[2];
    if(est == "xlsx")
      return this.immagini[3];
    return this.immagini[0];
  }
  
  onPageChange(event: PageEvent){ //per la paginazione
    const startIndex = event.pageIndex*event.pageSize;
    let endIndex = startIndex+event.pageSize;
    if(endIndex > this.retRicerca.length)
      endIndex = this.retRicerca.length;
    this.pageSlice=this.retRicerca.slice(startIndex,endIndex);
  }
  
  public async ricercaConFiltri(){
    let utente = await this.utenteService.getUtente();
    let anno: any = parseInt(this.annoRic.value,10);
    let cat: any = this.currentCat;
    let prz: number = parseFloat(this.currentPrz.value);
    if(this.annoRic.value === "" || this.annoRic.value === " ")
      anno = null;
    if(this.currentCat === "" || this.currentCat === " "){
      cat = null;
      this.mostraDocumenti();
      return;
    }
    if(prz === 0)
      prz = Number.MAX_VALUE;
    this.databaseService.ricercaConFiltri(cat,anno,prz,utente).subscribe({
      next: (res) => {
        this.retRicerca = res;
        this.pageSlice = this.retRicerca.slice(0,6);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}