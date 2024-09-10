import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {

  }


}
