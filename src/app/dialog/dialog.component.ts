import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { UtenteService } from '../services/utente.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  ret:number[] = [];
  categorie: string[] = ["Casa","Tasse e Imposte","Spese sanitarie","Spese alimentari","Istruzione","Sport","Trasporti","Cura personale"
  ,"Viaggi","Attività ricreative","Altro"];
  totale = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { categoria: string, anno: number },
    private databaseService: DatabaseService, private utenteService:UtenteService) { }

  ngOnInit(): void {
    this.ricercaConFiltri();
  }

  async ricercaConFiltri() {
    let utente = await this.utenteService.getUtente();
    if (this.data.categoria !== " " && this.data.anno !== null) {
      this.databaseService.spesePerCategoria_Anno(this.data.anno, [this.data.categoria],utente).subscribe({
        next: (res) => {
          this.ret = res;
        }
      });
    } else if (this.data.categoria === " " && this.data.anno !== null) {
      for(let i=0; i<this.categorie.length; i++){
        this.databaseService.spesePerCategoria_Anno(this.data.anno, [this.categorie[i]],utente).subscribe({
          next: (res) => {
            this.ret[i] = res[0];
          }
        })
      }
      this.databaseService.spesePerAnno(this.data.anno,this.data.anno,utente).subscribe({
        next: (res) =>{
          this.totale = res[0];
        }
      })
    }
    else if (this.data.anno === null) {
      this.databaseService.spesePerCategoria([this.data.categoria],utente).subscribe({
        next: (res) => {
          this.ret = res;
        }
      });
    }
  }
}