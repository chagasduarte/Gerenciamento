import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-planejamento-comp',
  imports: [],
  templateUrl: './planejamento-comp.component.html',
  styleUrl: './planejamento-comp.component.css'
})
export class PlanejamentoCompComponent implements OnChanges {
  @Input() planejado: number = 100;
  @Input() valorReal: number = 10;
  @Input() nome: string = "Entrada";
  percentual = 0;
  ngOnChanges(): void {
    this.preencherPlanejamento();
  }
  
  preencherPlanejamento(){
    console.log(this.valorReal)
    if (this.planejado > 0) {
      this.percentual = Math.min(
        Math.round((this.valorReal / this.planejado) * 100),
        100
      );
    } else {
      this.percentual = 0;
    }
  }
}
