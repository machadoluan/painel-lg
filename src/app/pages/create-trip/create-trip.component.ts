import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { pacientes } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RouterLink } from '@angular/router';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from '../../service/toastr.service';
import { ViagensService } from '../../service/viagens.service';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-create-trip',
  imports: [DialogModule, InputTextModule, TextareaModule, SelectModule, CommonModule, RouterLink, DatePickerModule, ReactiveFormsModule, InputNumberModule],

  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss'
})
export class CreateTripComponent implements AfterViewInit, OnInit {
  dadosCadastroTrips: FormGroup
  user: any;

  constructor(
    private fb: FormBuilder,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {
    this.dadosCadastroTrips = this.fb.group({
      cliente: ["", Validators.required],
      origem: ["", Validators.required],
      destino: ["", Validators.required],
      valor: [null, [Validators.required, this.valorMinimo(0.01)]],
      dataInicio: ["", Validators.required],
      dataFim: [""],
      descricao: [""]
    })
  }


  valorMinimo(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value < min) {
        return { valorInvalido: true };
      }
      return null;
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken()
  }


  ngAfterViewInit(): void {
    const inputs = ['dataInicioInput', 'dataFimInput'];

    inputs.forEach((id) => {
      const dateInput = document.getElementById(id) as HTMLInputElement;

      if (dateInput) {
        dateInput.addEventListener('input', () => {
          let value = dateInput.value.replace(/\D/g, ''); // Remove não números

          if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
          if (value.length > 4) value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

          dateInput.value = value.substring(0, 10);
        });
      }
    });
  }

  createTrip() {

    const dadosFormatados = {
      ...this.dadosCadastroTrips.value,
      dataInicio: this.formatarData(this.dadosCadastroTrips.value.dataInicio), // Formatar data
      dataFim: this.dadosCadastroTrips.value.dataFim ? this.formatarData(this.dadosCadastroTrips.value.dataFim) : '' // Formatar 
    };

    const dadosParaEnviar = this.filtrarDados(dadosFormatados)

    console.log(dadosParaEnviar)
    this.tripService.createTrip(dadosParaEnviar, this.user).subscribe(
      (res) => {
        this.toastrService.showSucess(`pacientes para ${dadosParaEnviar.destino} criada.`)
        this.dadosCadastroTrips.reset();
      },
      (err) => {
        this.toastrService.showError(`Erro ao cadastrar a pacientes, tente novamente mais tarde. `)
        console.error(err)
      }
    )
  }

  formatarData(data: Date | string): string {
    const dateObj = new Date(data); // Converte para objeto Date
    const dia = String(dateObj.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos
    const ano = dateObj.getFullYear(); // Ano com 4 dígitos
    return `${dia}/${mes}/${ano}`; // Formato dd/MM/yyyy
  }

  filtrarDados(dados: any): any {
    const dadosFiltrados: any = {};

    for (const key in dados) {
      if (dados[key] !== "" && dados[key] !== null && dados[key] !== undefined) {
        // Adiciona apenas os campos que não estão vazios
        dadosFiltrados[key] = dados[key];
      }
    }

    return dadosFiltrados;
  }

}
