import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-objetivos',
  imports: [ReactiveFormsModule],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent {

  form = new FormGroup( {
    valorCompra: new  FormControl(0),
    valorTotal: new FormControl(0),
    valorMinimoRevenda: new FormControl(0),
    valorLucro: new FormControl(0),
    quantidade: new FormControl(0)
  })

  calculaPorcentagem() {
    this.form.controls.valorTotal.setValue((Number(this.form.controls.valorCompra.value!.toString()) * Number(this.form.controls.quantidade.value!.toString())) * 1.02)
    this.form.controls.valorMinimoRevenda.setValue(Number(this.form.controls.valorTotal.value!.toString()) * 1.02)
    this.form.controls.valorLucro.setValue(Number(this.form.controls.valorMinimoRevenda.value!.toString()) - (Number(this.form.controls.valorTotal.value!.toString()) * 1.02))
  }
  calculaLucro(){
    this.form.controls.valorLucro.setValue((Number(this.form.controls.valorMinimoRevenda.value!.toString()) *  Number(this.form.controls.quantidade.value!.toString()) )- (Number(this.form.controls.valorTotal.value!.toString()) * 1.02))
  }
}
