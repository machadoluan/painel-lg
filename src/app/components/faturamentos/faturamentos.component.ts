import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ViagensService } from '../../service/viagens.service';
import { faturamentos } from '../../types/models.type';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-faturamentos',
  imports: [DialogModule, CommonModule],
  templateUrl: './faturamentos.component.html',
  styleUrl: './faturamentos.component.scss'
})
export class FaturamentosComponent implements OnInit {
  display: boolean = false

  constructor(private tripService: ViagensService) { }

  faturamentos: faturamentos[] = []


  ngOnInit(): void {
    this.tripService.faturamento().subscribe({
      next: (data) => {
        this.faturamentos = data
        console.log(this.faturamentos)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  formatarDinheiro(valor: string | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    const money = parseInt(valor)
    
    return money.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

}
