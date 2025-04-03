import { Component, HostListener, OnInit } from '@angular/core';
import { registro, pacientes } from '../../types/models.type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ViagensService } from '../../service/viagens.service';
import { ToastrService } from '../../service/toastr.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import html2pdf from 'html2pdf.js';
import { Table, TableModule } from 'primeng/table';
import { ReportsService } from '../../service/reports.service';





@Component({
  selector: 'app-trip-details',
  imports: [CommonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    FormsModule,
    SelectModule,
    RouterLink,
    ReactiveFormsModule,
    DialogModule,
    InputNumberModule,
    TableModule
  ],
  standalone: true,
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss'
})
export class TripDetailsComponent implements OnInit {
  showDialog: boolean = false;
  isMobile: boolean = window.innerWidth <= 750;
  pacientes: pacientes | undefined
  editTrip: boolean = false;
  dataInicioFormatada: string = '';
  dataFimFormatada: string = '';
  dadosUpdate: FormGroup
  reports: registro[] = [];
  dropdownMenu: boolean = false;



  statusOptions = [
    { Status: "Em andamento" },
    { Status: "Concluído" }
  ]


  constructor(
    private fb: FormBuilder,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService

  ) {
    this.dadosUpdate = this.fb.group({
      cliente: [{ value: "", disabled: true }],
      origem: [{ value: "", disabled: true }],
      destino: [{ value: "", disabled: true }],
      valor: [{ value: 0, disabled: true }],
      dataInicio: [{ value: "", disabled: true }],
      dataFim: [{ value: "", disabled: true }],
      descricao: [{ value: "", disabled: true }]
    })
  }

  editar() {
    this.dadosUpdate.get('cliente')?.enable();
    this.dadosUpdate.get('origem')?.enable();
    this.dadosUpdate.get('destino')?.enable();
    this.dadosUpdate.get('dataInicio')?.enable();
    this.dadosUpdate.get('valor')?.enable();
    this.dadosUpdate.get('dataFim')?.enable();
    this.dadosUpdate.get('descricao')?.enable();
    this.editTrip = true
    this.dropdownMenu = false
  }



  ngOnInit(): void {
    this.loadTrips()
    if (!this.isMobile) {
      this.openDialog()
    }


  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 750;
  }

  openDropDown() {
    this.dropdownMenu = !this.dropdownMenu
  }

  openDialog() {
    if (!this.isMobile) {
      this.showDialog = true;
    }
  }

  closeDialog() {
    this.showDialog = false;
  }

  shareTrip() {
  

  }

  loadReportsSpecific(pacientesId: number) {
    this.reportService.getReports().subscribe({
      next: (res: any) => {
        this.reports = res.reportsFormatados.filter((r: any) => r.pacientes_id === pacientesId);
        console.log("Registro da pacientes:", this.reports);
      }
    })
  }

  loadTrips() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReportsSpecific(parseInt(id))
    }
    if (id) {
      console.log(parseInt(id))
      this.tripService.getTripById(parseInt(id)).subscribe(
        (data) => {
          this.pacientes = data;
          this.dadosUpdate.patchValue(data)
          console.log("dados", this.dadosUpdate.value)
          console.log('data formata', this.formatarData(this.dadosUpdate.value.dataInicio))


        },
        (err) => {
          console.error("Deu error:", err)
        }
      )

    } else {
      console.error("ID is null");
    }
  }



  tripsUpdate() {
    // if (!this.pacientes?.id) {
    //   this.toastrService.showError('ID da pacientes não encontrado.');
    //   return;
    // }

    // if (!this.dadosUpdate.dirty) {
    //   this.dadosUpdate.get('cliente')?.disable();
    //   this.dadosUpdate.get('origem')?.disable();
    //   this.dadosUpdate.get('destino')?.disable();
    //   this.dadosUpdate.get('dataInicio')?.disable();
    //   this.dadosUpdate.get('valor')?.disable();
    //   this.dadosUpdate.get('dataFim')?.disable();
    //   this.dadosUpdate.get('descricao')?.disable();
    //   this.editTrip = false
    // }

 

    // const dadosParaEnviar = this.filtrarDados(dadosFormatados);

    // console.log("Update", dadosFormatados)

    // this.tripService.updateTrip(dadosFormatados).subscribe(
    //   (res) => {
    //     this.toastrService.showSucess(`pacientes para ${dadosParaEnviar.destino} atualizada `);
    //     this.dadosUpdate.get('cliente')?.disable();
    //     this.dadosUpdate.get('origem')?.disable();
    //     this.dadosUpdate.get('destino')?.disable();
    //     this.dadosUpdate.get('dataInicio')?.disable();
    //     this.dadosUpdate.get('valor')?.disable();
    //     this.dadosUpdate.get('dataFim')?.disable();
    //     this.dadosUpdate.get('descricao')?.disable();
    //     this.editTrip = false
    //   },
    //   (err) => {
    //     this.toastrService.showError(`Erro ao atualizar a pacientes, tente novamente mais tarde. `);
    //     console.error(err);
    //   }
    // );
  }

  formatarData(data: Date | string): string {
    if (!data) return ''; // Retorna string vazia se for nulo/indefinido

    if (typeof data === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data; // Se já estiver no formato dd/MM/yyyy, retorna como está
    }

    const dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return ''; // Verifica se a data é inválida

    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const ano = dateObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
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


  delete(pacientes: any) {
    console.log('Método delete chamado');
    this.dropdownMenu = false
    this.confirmationService.confirm({
      message: `Você deseja deletar permanente?`,
      header: 'Deletar pacientes',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        // this.tripService.deleteTripId(pacientes.id).subscribe(
        //   (res) => {
        //     this.toastrService.showSucess(`pacientes apagada com sucesso!`)
        //     this.router.navigate(['/trip'])

        //   },
        //   (err) => {
        //     this.toastrService.showError(`Erro ao deletar pacientes, tente novamente mais tarde!`)

        //   }
        // )

      },
      reject: () => {
      },
    });
  }

  redirecionar() {
    this.router.navigate(['/trip'])
  }

  formatarDinheiro(valor: number | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // exportToPDF() {
  //   console.log('Exportando para PDF...');
  
  //   const element = document.getElementById('contentToConvert');
  //   if (!element) {
  //     console.error('Elemento não encontrado!');
  //     return;
  //   }
  
  //   // Temporariamente mostra o conteúdo só pra exportar, mas invisível
  //   element.style.visibility = 'visible';
  //   element.style.position = 'fixed';
  //   element.style.top = '0';
  //   element.style.left = '0';
  //   element.style.width = '100%';
  
  //   const options = {
  //     filename: `${this.pacientes?.origem}-${this.pacientes?.destino}.pdf`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  
  //   // Exporta o conteúdo
  //   html2pdf().from(element).set(options).save().then(() => {
  //     // Esconde de novo depois de exportar
  //     element.style.visibility = 'hidden';
  //     element.style.position = 'static';
  //   });
  // }
  
  

}
