import { Component, OnInit } from '@angular/core';
import { user } from '../entity/user';
import { ChartOptions, ChartType } from 'chart.js';
import { UtenteService } from '../services/utente.service';
import { Utente } from '../entity/Utente';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userInfo!: user;

  constructor(private utenteService: UtenteService) { }

  async ngOnInit() {
    this.userInfo = await this.utenteService.getUserInfo();
  }

  async registraUtente(){
    
    let utente = new Utente(this.userInfo.userDetails);
    this.utenteService.registraUtente(utente).subscribe({
      next: (res) => {
      },
      error: (err:any) => {
        console.error(err);
      }
    });
  }
}
