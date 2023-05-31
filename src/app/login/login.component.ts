import { Component, OnInit } from '@angular/core';
import { user } from '../entity/user';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  doughnutChartData: any[] = [10,20,30,40];
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
  userInfo!: user;

  constructor() { }

  async ngOnInit() {
    this.userInfo = await this.getUserInfo();
  }

  async getUserInfo() {
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
}
