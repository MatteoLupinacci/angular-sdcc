import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Documento } from '../entity/Documento';
import { BlobService } from '../services/blob.service';
import { DatabaseService } from '../services/database.service';
import { ChartOptions, ChartType } from 'chart.js';
import { user } from '../entity/user';
import { UtenteService } from '../services/utente.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
   doughnutChartData: any[] = [];
   doughnutChartLegend = true;
   doughnutChartType: ChartType = 'doughnut';
   doughnutChartLabels = ["Casa","Tasse e Imposte","Spese sanitarie","Spese alimentari"];
   doughnutChartOptions: ChartOptions = {
    responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Spese totali per le categorie'
        }
      }
  };
  
   pieChartData: any[] = [];
   pieChartLegend = true;
   pieChartType: ChartType = 'pie';
   pieChartLabels = ['Casa','Tasse e Imposte','Spese Sanitarie','Altro'];
   pieChartOptions: ChartOptions = {
    responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Spese totali nel 2023 per le categorie'
        }
      }
  };

   doughnutChartData2: any[] = [];
   doughnutChartLegend2 = true;
   doughnutChartType2: ChartType = 'doughnut';
   doughnutChartLabels2 = ["Istruzione","Sport","Trasporti","Altro"];
   doughnutChartOptions2: ChartOptions = {
    responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Spese totali per le categorie'
        }
      }
  };
  
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

  sas: string = "sp=racwdli&st=2023-05-15T21:56:40Z&se=2023-10-01T05:56:40Z&spr=https&sv=2022-11-02&sr=c&sig=lu3kf0SOjckYI7V40HqM4z0Ns0eQ5NxcE8sjx%2FN%2BoaU%3D";
  blob: any;
  user!:user;

  categorie: String[] = [" ","Casa","Tasse e Imposte","Spese sanitarie","Spese alimentari","Istruzione","Sport","Trasporti","Altro"];
  nome:FormControl = new FormControl("",[]);  //approccio model driven
  currentCat: string = ' ';
  anno:FormControl = new FormControl("2023",[]);  //approccio model driven
  retRicerca: Documento[] = [];
  pageSlice = this.retRicerca.slice(0,4);
  immagini = ["https://static.vecteezy.com/ti/vettori-gratis/t2/20586980-doc-file-formato-documento-colore-icona-vettore-illustrazione-vettoriale.jpg",
              "https://static.vecteezy.com/ti/vettori-gratis/t2/19572895-ricerca-file-pdf-documento-colore-icona-illustrazione-vettoriale.jpg",
            "https://static.vecteezy.com/ti/vettori-gratis/t2/7318804-jpg-file-icona-colore-immagine-digitale-formato-file-isolato-illustrazione-vettoriale.jpg",
            "https://static.vecteezy.com/ti/vettori-gratis/t2/20586482-csv-file-formato-documento-colore-icona-vettore-illustrazione-vettoriale.jpg"];
  przMax:FormControl = new FormControl("5000",[]);  //approccio model driven
  
  constructor(private databaseService:DatabaseService, private blobService:BlobService, private utenteService:UtenteService, private dialog: MatDialog) { }

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

  async ngOnInit() {
    this.user = await this.utenteService.getUserInfo();
    this.mostraDocumenti();
    this.speseTotaliPerCategoria_Anno();
    this.speseTotaliPerCategoria(1);
    this.speseTotaliPerCategoria(2);
    this.speseTotaliPerAnno();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'50%',
      data: {
        categoria: this.currentCat,
        anno: this.anno.value
      },
    });
  }
  
  public downloadBlobs(name: string) {
    name = this.user.userDetails+"/"+name;  //IL NOME è DEL TIPO utente/nomeBlob
    this.blobService.downloadBlob(name, this.sas, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  public async mostraDocumenti() {
    (await this.databaseService.mostraDocumenti()).subscribe({
      next: (res) => {
        this.retRicerca = res;
        this.pageSlice = this.retRicerca.slice(0,4);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  public async speseTotaliPerCategoria(gruppo:number): Promise<number[]> {
    let utente = await this.utenteService.getUtente();
    let ret: any[] = [];
    let label = this.doughnutChartLabels;
    if(gruppo===2){
      label = this.doughnutChartLabels2;
    }
    this.databaseService.spesePerCategoria(label,utente).subscribe({
      next: (res) => {
        if(gruppo === 1){
          this.doughnutChartData = [
            { data: res,
            }
          ];
        }
        else{
          this.doughnutChartData2 = [
            { data: res,
            }
          ];
        }
        
      },
      error: (err) => {
        console.error(err);
      }
    });
    return ret;
  }

  public async speseTotaliPerCategoria_Anno(): Promise<number[]> {
    let utente = await this.utenteService.getUtente();
    let ret: any[] = [];
    this.databaseService.spesePerCategoria_Anno(2023,this.pieChartLabels,utente).subscribe({
      next: (res) => {
        this.pieChartData = [
          { data: res,
          }
        ];
      },
      error: (err) => {
        console.error(err);
      }
    });
    return ret;
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
  
  public async ricercaConFiltri(){
    let utente = await this.utenteService.getUtente();
    let anno: any = parseInt(this.anno.value,10);
    let cat: any = this.currentCat;
    let prz: number = parseFloat(this.przMax.value);
    if(this.anno.value === "" || this.anno.value === " ")
      anno = null;
    if(this.currentCat === "" || this.currentCat === " "){
      cat = null;
    }
    if(prz === 0)
      prz = Number.MAX_VALUE;
    this.databaseService.ricercaConFiltri(cat,anno,prz,utente).subscribe({
      next: (res) => {
        this.retRicerca = res;
        this.pageSlice = this.retRicerca.slice(0,12);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
