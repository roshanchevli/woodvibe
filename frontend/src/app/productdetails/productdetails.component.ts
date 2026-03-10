import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {

  product: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(){

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    console.log("Route ID:", id);

    if(id){
      this.api.getProductById(id).subscribe(data=>{
        console.log("Product Data:", data);
        this.product = data;
      });
    }

  });

}

}