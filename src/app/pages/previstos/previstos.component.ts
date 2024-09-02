import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-previstos',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './previstos.component.html',
  styleUrl: './previstos.component.css'
})
export class PrevistosComponent implements OnInit, AfterViewInit {
  ids: number[] = [];
  parcelas: Parcela[] = [];
  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly parcelasService: ParcelasService
  ){
    this.activeRoute.queryParamMap.subscribe(x => {
      x.keys.map(id => this.ids.push(parseInt(x.get(id)!.toString())))
    });
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.buscaParcelas();
  }

  buscaParcelas(){
    this.ids.forEach(id => {
      this.parcelasService.GetParcela(id).subscribe(x => {
        this.parcelas.push(x);
      })
    });
  }

}
