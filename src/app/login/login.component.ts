import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  logged = false;
  user: string = "matteolupinacci171@gmail.com";
  password: string = "matteooo";
  constructor() { }

  ngOnInit(): void {
  }

  login() {
    this.logged=true;
  }
}
