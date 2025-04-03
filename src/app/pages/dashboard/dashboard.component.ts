import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { registro, pacientes } from '../../types/models.type';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CreateTripsComponent } from '../../components/create-trips/create-trips.component';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { ViagensService } from '../../service/viagens.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ReportsService } from '../../service/reports.service';
import { HttpClient } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { FaturamentosComponent } from '../../components/faturamentos/faturamentos.component';
import {
  NgApexchartsModule, ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CreateTripsComponent, CreateReportsComponent, DatePickerModule, DialogModule, InputNumberModule, ReactiveFormsModule, InputTextModule, FaturamentosComponent,
    TextareaModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  @ViewChild(CreateTripsComponent, { static: true }) dialogCreateTrips!: CreateTripsComponent;
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;
  @ViewChild(FaturamentosComponent, { static: true }) faturamentosComponent!: FaturamentosComponent;
  showDialog: boolean = false;
  showReportDialog: boolean = false;

  public chartOptions: Partial<ChartOptions> = {
    series: [], // Evita `undefined`
    chart: { type: "line", height: 350 }, // Define valores padrão
    xaxis: { type: "datetime", categories: [] }, // Inicializa corretamente
    stroke: { curve: "smooth" }, // Evita `undefined`
    tooltip: { x: { format: "dd/MM/yy HH:mm" } }, // Evita `undefined`
    dataLabels: { enabled: false } // Inicializa corretamente
  };



  viagens: pacientes[] = [];
  pacientesDetails: any;
  registros: registro[] = [];
  isMobile: boolean = window.innerWidth <= 750;
  ultimoRegistro: any;
  user: any;
  faturamento: any;
  dadosUpdate: FormGroup;
  editTrip: boolean = false
  fullScreenImageUrl: string | null = null;
  mesReferente: number = 0;
  anoAtual: number = 0;

  registroTipo: any[] = [
    { Tipo: 'Inicio de Jornada' },
    { Tipo: 'Fim de Jornada' },
    { Tipo: 'Inicio Refeição' },
    { Tipo: 'Fim Refeição' },
    { Tipo: 'Inicio Pausa' },
    { Tipo: 'Fim Pausa' },
    { Tipo: 'Inicio Espera' },
    { Tipo: 'Reinicio de pacientes' },
  ]

  constructor(
    private tripService: ViagensService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService,
    private http: HttpClient

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

    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth" as any
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
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
  }

  ngOnInit(): void {
    this.loadTrips()
    this.loadReports()
    this.calcularMesReferente()
    const dataAtual = new Date();
    this.anoAtual = dataAtual.getFullYear();
  }

  calcularMesReferente(): void {
    const dataAtual = new Date(); // Data atual
    const diaAtual = dataAtual.getDate(); // Dia do mês atual
    const mesAtual = dataAtual.getMonth() + 1; // Mês atual (1 a 12)

    // Lógica para determinar o mês referente
    if (diaAtual >= 26) {
      // Se o dia atual for 26 ou posterior, o mês referente é o próximo mês
      this.mesReferente = mesAtual + 1;
      if (this.mesReferente > 12) {
        // Se passar de dezembro, volta para janeiro do próximo ano
        this.mesReferente = 1;
      }
    } else {
      // Se o dia atual for anterior a 26, o mês referente é o mês atual
      this.mesReferente = mesAtual;
    }
  }

  loadTrips() {
    this.tripService.getTrips().subscribe(
      (data) => {
        this.viagens = data;

        // Define o mês e ano atual
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth() + 1; // getMonth() retorna 0-11

        const anoAtual = dataAtual.getFullYear();

        // Calcula o faturamento do mês atual
        // this.faturamento = this.calcularFaturamento(this.viagens, mesAtual, anoAtual);
        this.tripService.faturamento(this.mesReferente, this.anoAtual).subscribe({
          next: (data) => {
            this.faturamento = data.total
          },
          error: (err) => {
            console.error(err)
          }
        })
        console.log(this.faturamento)
      },
      (err) => {
        console.error("Error ao buscar viagens:", err)
      }
    )
  }

  loadReports() {
    this.reportService.getReports().subscribe(
      (data: any) => {
        this.registros = data.reportsFormatados

        this.ultimoRegistro = this.registros[this.registros.length - 1]
      },
      (err) => {
        console.error("Error ao buscar registros:", err)
      }
    )
  }

  formatarDinheiro(valor: number | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


  criarpacientes() {
    this.dialogCreateTrips.showDialog()
  }

  openpacientes(pacientes: pacientes) {
    // if (this.isMobile) {
    //   this.router.navigate(['/trip', pacientes.id])
    // } else {
    //   this.pacientesDetails = pacientes
    //   this.showDialog = true
    //   const id = pacientes.id
    //   if (id) {
    //     console.log(id)
    //     this.tripService.getTripById(id).subscribe(
    //       (data) => {
    //         this.pacientesDetails = data;
    //         this.dadosUpdate.patchValue(data)
    //         console.log("dados", this.dadosUpdate.value)
    //         console.log('data formata', this.formatarData(this.dadosUpdate.value.dataInicio))

    //       },
    //       (err) => {
    //         console.error("Deu error:", err)
    //       }
    //     )

    //   } else {
    //     console.error("ID is null");
    //   }
    // }


  }
  openRegistro(registro: pacientes) {
    this.router.navigate(['/report', registro.id])

  }

  criarRegistro() {
    this.dialogCreateReports.showDialog()
  }



  tripsUpdate() {
    if (!this.pacientesDetails?.id) {
      this.toastrService.showError('ID da pacientes não encontrado.');
      return;
    }

    if (!this.dadosUpdate.dirty) {
      this.dadosUpdate.get('cliente')?.disable();
      this.dadosUpdate.get('origem')?.disable();
      this.dadosUpdate.get('destino')?.disable();
      this.dadosUpdate.get('dataInicio')?.disable();
      this.dadosUpdate.get('valor')?.disable();
      this.dadosUpdate.get('dataFim')?.disable();
      this.dadosUpdate.get('descricao')?.disable();
      this.editTrip = false
    }

    const dadosFormatados = {
      ...this.dadosUpdate.value,
      id: this.pacientesDetails.id, // Inclui o ID da pacientes
      dataInicio: this.formatarData(this.dadosUpdate.value.dataInicio), // Formatar data
      dataFim: this.dadosUpdate.value.dataFim ? this.formatarData(this.dadosUpdate.value.dataFim) : '' // Formatar 
    };

    const dadosParaEnviar = this.filtrarDados(dadosFormatados);

    console.log("Update", dadosFormatados)

    this.tripService.updateTrip(dadosFormatados).subscribe(
      (res) => {
        this.toastrService.showSucess(`pacientes para ${dadosParaEnviar.destino} atualizada `);
        this.dadosUpdate.get('cliente')?.disable();
        this.dadosUpdate.get('origem')?.disable();
        this.dadosUpdate.get('destino')?.disable();
        this.dadosUpdate.get('dataInicio')?.disable();
        this.dadosUpdate.get('valor')?.disable();
        this.dadosUpdate.get('dataFim')?.disable();
        this.dadosUpdate.get('descricao')?.disable();
        this.editTrip = false
      },
      (err) => {
        this.toastrService.showError(`Erro ao atualizar a pacientes, tente novamente mais tarde. `);
        console.error(err);
      }
    );
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


  delete(event: Event, pacientes: any) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
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
        this.tripService.deleteTripId(pacientes.id).subscribe(
          (res) => {
            this.toastrService.showSucess(`pacientes apagada com sucesso!`)
            window.location.reload()
          },
          (err) => {
            this.toastrService.showError(`Erro ao deletar pacientes, tente novamente mais tarde!`)

          }
        )

      },
      reject: () => {
      },
    });
  }




  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  downloadImage(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      // Cria um link temporário
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'image.jpg'; // Nome do arquivo que será baixado
      document.body.appendChild(link);
      link.click(); // Simula o clique no link para iniciar o download

      // Limpa o objeto URL e remove o link do DOM
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, error => {
      console.error('Erro ao baixar a imagem:', error);
    });
  }

  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl;
  }
  redirecionar() {
    window.location.reload()
  }
}
