import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Documento } from '../entity/Documento';
import { BlobService } from '../services/blob.service';
import { DatabaseService } from '../services/database.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
   doughnutChartData: any[] = [];
   doughnutChartLegend = true;
   doughnutChartType: ChartType = 'doughnut';
   doughnutChartLabels = ['Spese alimentari','Istruzione','Sport','Trasporti'];
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
  
   polarChartData: any[] = [];
   polarChartLegend = true;
   polarChartType: ChartType = 'polarArea';
   polarChartLabels = ['2020','2021','2022','2023'];
   polarChartOptions: ChartOptions = {
    responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Spese totali dal 2020 al 2023'
        }
      }
  };
  
  sas: string = "sp=racwdli&st=2023-05-15T21:56:40Z&se=2023-10-01T05:56:40Z&spr=https&sv=2022-11-02&sr=c&sig=lu3kf0SOjckYI7V40HqM4z0Ns0eQ5NxcE8sjx%2FN%2BoaU%3D";
  blob: any;

  categorie: String[] = ["","Casa","Tasse e Imposte","Spese sanitarie","Spese alimentari","Istruzione","Sport","Trasporti","Cura personale"
  ,"Viaggi","Attività ricreative","Altro"];
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
  
  constructor(private databaseService:DatabaseService, private blobService:BlobService) { }

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

  ngOnInit() {
    this.mostraDocumenti();
    this.speseTotaliPerCategoria_Anno();
    this.speseTotaliPerCategoria();
    this.speseTotaliPerAnno();
  }

  public mostraDocumenti() {
    this.databaseService.mostraDocumenti().subscribe({
      next: (res) => {
        this.retRicerca = res;
        this.pageSlice = this.retRicerca.slice(0,4);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  public speseTotaliPerCategoria(): number[] {
    let ret: any[] = [];
    this.databaseService.spesePerCategoria(this.doughnutChartLabels).subscribe({
      next: (res) => {
        this.doughnutChartData = [
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

  public speseTotaliPerCategoria_Anno(): number[] {
    let ret: any[] = [];
    this.databaseService.spesePerCategoria_Anno(2023,this.pieChartLabels).subscribe({
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

  public speseTotaliPerAnno(): number[] {
    let ret: any[] = [];
    this.databaseService.spesePerAnno(2020, 2023).subscribe({
      next: (res) => {
        this.polarChartData = [
          { data: res,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
            ],
            borderWidth: 3 
          }
        ];
      },
      error: (err) => {
        console.error(err);
      }
    });
    return ret;
  }

  public downloadBlobs(name: string) {
    this.blobService.downloadBlob(name, this.sas, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  public ricercaConFiltri(){
    let anno: any = parseInt(this.anno.value,10);
    let cat: any = this.currentCat;
    let prz: number = parseFloat(this.przMax.value);
    if(this.anno.value === "" || this.anno.value === " ")
      anno = null;
    if(this.currentCat === "" || this.currentCat === " ")
      cat = null;
    if(prz === 0)
      prz = Number.MAX_VALUE;
    this.databaseService.ricercaConFiltri(cat,anno,prz).subscribe({
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
