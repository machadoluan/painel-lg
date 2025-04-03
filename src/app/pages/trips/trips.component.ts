import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { registro, pacientes } from '../../types/models.type';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Router, RouterLink } from '@angular/router';
import { CreateTripsComponent } from "../../components/create-trips/create-trips.component";
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ViagensService } from '../../service/viagens.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from '../../service/toastr.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ReportsService } from '../../service/reports.service';
import html2pdf from 'html2pdf.js';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { CreateReportComponent } from "../create-report/create-report.component";




@Component({
  selector: 'app-trips',
  imports: [InputIcon,
    IconField,
    InputTextModule,
    TableModule,
    Tag,
    CommonModule,
    DialogModule,
    SelectButtonModule,
    FormsModule,
    CreateTripsComponent,
    OverlayBadgeModule,
    PopoverModule,
    ButtonModule,
    RouterLink, CreateReportComponent, CreateReportsComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;

  @ViewChild('dt1') dt1!: Table;


  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];
  pacientes: any[] = [
    {
      id: 1,
      nomeClinica: 'Clínica Saúde Total',
      nomeDoutor: 'Dr. Carlos Silva',
      nomePaciente: 'Ana Paula Oliveira',
      sexo: 'Feminino',
      hora: '14:30',
      email: 'ana.oliveira@email.com',
      dataInicio: '15/03/2023',
      dataFinal: '30/03/2023',
      previsaoDias: 15,
      instrucoes: 'Repouso e medicação conforme prescrito',
      status: 'Pickup needed'
    },
    {
      id: 2,
      nomeClinica: 'Centro Médico Esperança',
      nomeDoutor: 'Dra. Juliana Santos',
      nomePaciente: 'Marcos Antônio Costa',
      sexo: 'Masculino',
      hora: '09:15',
      email: 'marcos.costa@email.com',
      dataInicio: '01/04/2023',
      dataFinal: '10/04/2023',
      previsaoDias: 10,
      instrucoes: 'Fisioterapia diária e acompanhamento',
      status: 'Completed'
    },
    {
      id: 3,
      nomeClinica: 'Instituto Bem Estar',
      nomeDoutor: 'Dr. Roberto Almeida',
      nomePaciente: 'Fernanda Lima',
      sexo: 'Feminino',
      hora: '16:45',
      email: 'fernanda.lima@email.com',
      dataInicio: '05/04/2023',
      dataFinal: '20/04/2023',
      previsaoDias: 15,
      instrucoes: 'Dieta especial e exames semanais',
      status: 'Received'
    },
    {
      id: 4,
      nomeClinica: 'Clínica Vida Plena',
      nomeDoutor: 'Dra. Patrícia Mendes',
      nomePaciente: 'Ricardo Gonçalves',
      sexo: 'Masculino',
      hora: '11:00',
      email: 'ricardo.goncalves@email.com',
      dataInicio: '10/04/2023',
      dataFinal: '25/04/2023',
      previsaoDias: 15,
      instrucoes: 'Repouso absoluto por 3 dias',
      status: 'In progress'
    },
    {
      id: 5,
      nomeClinica: 'Hospital Santa Helena',
      nomeDoutor: 'Dr. Eduardo Pereira',
      nomePaciente: 'Mariana Castro',
      sexo: 'Feminino',
      hora: '08:30',
      email: 'mariana.castro@email.com',
      dataInicio: '12/04/2023',
      dataFinal: '12/05/2023',
      previsaoDias: 30,
      instrucoes: 'Tratamento intensivo com acompanhamento diário',
      status: 'Out for delivery'
    },
    {
      id: 6,
      nomeClinica: 'Hospital Santa Helena',
      nomeDoutor: 'Dr. Eduardo Pereira',
      nomePaciente: 'Mariana Castro',
      sexo: 'Feminino',
      hora: '08:30',
      email: 'mariana.castro@email.com',
      dataInicio: '12/04/2023',
      dataFinal: '12/05/2023',
      previsaoDias: 30,
      instrucoes: 'Tratamento intensivo com acompanhamento diário',
      status: 'Delivered'
    }
  ];
  filteredViagens: any[] = [];
  filter: boolean = false
  selectedTrips: pacientes[] = []
  selectedFilters: string[] = [];
  searchText: string = '';
  reports: registro[] = [];
  pacientesSelecionada: any;

  constructor(
    private router: Router,
    private tripService: ViagensService,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService,
    private eRef: ElementRef
  ) {
  }

  @HostListener('document:click', ['$event'])
  fecharFiltro(event: Event) {
    if (this.filter && !this.eRef.nativeElement.contains(event.target)) {
      this.filter = false;
    }
  }

  ngOnInit(): void {
    console.log(this.selectedTrips)
    this.loadTrips()
    console.log(this.pacientes)
  }

  viagessm(pacientes: any) {
    console.log(pacientes)
  }

  showDialog(pacientes: any) {
    this.displayDialog = true;
    this.loadReportsSpecific(pacientes[0].id)
    this.pacientesSelecionada = this.selectedTrips[0]

  }

  hideDialog() {
    this.displayDialog = false;
  }

  export() {
    if (this.selectedFormat === 'pdf') {
      this.exportToPDF();
    } else if (this.selectedFormat === 'excel') {
      this.exportToExcel();
    }
    this.hideDialog();
  }

  exportToPDF() {
    console.log('Exportando para PDF...');

    if (!this.selectedTrips || this.selectedTrips.length === 0) {
      console.error('Nenhuma pacientes selecionada!');
      return;
    }

    this.selectedTrips.forEach((trip: any) => {
      this.loadReportsSpecific(trip.id);
      this.pacientesSelecionada = trip;

      setTimeout(() => {  // Delay para garantir que os dados carregaram
        const element = document.getElementById('contentToConvert');
        if (!element) {
          console.error('Elemento não encontrado!');
          return;
        }

        console.log('Elemento encontrado:', element);

        const options = {
          filename: `${trip.origem}-${trip.destino}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(element).set(options).save();
      }, 500); // Dá um tempinho pra renderizar
    });
  }


  exportToExcel() {
  //   console.log('Exportando para Excel...');

  //   // Verifica se selectedTrips está vazio e usa viagens como fallback
  //   const dadosExportacao = this.selectedTrips.length > 0 ? this.selectedTrips : this.viagens;

  //   // Verifica os dados para exportação
  //   if (!dadosExportacao || dadosExportacao.length === 0) {
  //     console.error('Nenhum dado para exportar.');
  //     return;
  //   }

  //   console.log('Dados para exportação:', dadosExportacao);

  //   // Cria uma planilha vazia
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

  //   // Adiciona um título na primeira linha
  //   XLSX.utils.sheet_add_aoa(worksheet, [['Relatório de Viagens']], { origin: 'A1' });

  //   // Adiciona cabeçalhos personalizados
  //   XLSX.utils.sheet_add_aoa(worksheet, [
  //     ['ID', 'Origem', 'Destino', 'Data Início', 'Data Fim', 'Status', 'Cliente', 'Valor (R$)', 'Descrição', 'Data de Criação', 'Data de Upload']
  //   ], { origin: 'A2' });

  //   // Adiciona os dados à planilha
  //   XLSX.utils.sheet_add_json(worksheet, dadosExportacao, {
  //     header: ['id', 'origem', 'destino', 'dataInicio', 'dataFim', 'status', 'cliente', 'valor', 'descricao', 'createdAt', 'updatedAt'],
  //     skipHeader: true, // Não adiciona o cabeçalho novamente
  //     origin: 'A3' // Começa a adicionar os dados a partir da linha 3
  //   });

  //   // Adiciona uma fórmula para somar os valores na coluna "valor"
  //   const totalRow = dadosExportacao.length + 3; // +3 para pular o título e os cabeçalhos
  //   XLSX.utils.sheet_add_aoa(worksheet, [['Total', , , , , , , { f: `SUM(H3:H${totalRow})` }, , ,]], { origin: `A${totalRow + 1}` });

  //   // Mescla células para o título
  //   worksheet['!merges'] = [
  //     { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } } // Mescla da coluna A até K na primeira linha
  //   ];

  //   // Aplica estilos ao título
  //   const titleCell = worksheet['A1'];
  //   if (titleCell) {
  //     titleCell.s = {
  //       font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
  //       alignment: { horizontal: 'center', vertical: 'center' },
  //       fill: { fgColor: { rgb: '4F81BD' } } // Cor de fundo azul
  //     };
  //   }

  //   // Aplica estilos aos cabeçalhos
  //   for (let col = 0; col < 11; col++) { // 11 colunas no total
  //     const headerCell = worksheet[XLSX.utils.encode_cell({ r: 1, c: col })];
  //     if (headerCell) {
  //       headerCell.s = {
  //         font: { bold: true, color: { rgb: 'FFFFFF' } },
  //         alignment: { horizontal: 'center' },
  //         fill: { fgColor: { rgb: '8DB4E2' } } // Cor de fundo azul claro
  //       };
  //     }
  //   }

  //   // Aplica estilos aos dados
  //   for (let row = 2; row <= totalRow; row++) {
  //     for (let col = 0; col < 11; col++) { // 11 colunas no total
  //       const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
  //       if (cell) {
  //         cell.s = {
  //           border: {
  //             top: { style: 'thin', color: { rgb: '000000' } },
  //             bottom: { style: 'thin', color: { rgb: '000000' } },
  //             left: { style: 'thin', color: { rgb: '000000' } },
  //             right: { style: 'thin', color: { rgb: '000000' } }
  //           },
  //           alignment: { horizontal: 'center' }
  //         };

  //         // Formata a coluna "Valor (R$)" como moeda
  //         if (col === 7) {
  //           cell.z = 'R$ #,##0.00';
  //         }

  //         // Formata as colunas de data
  //         if (col === 9 || col === 10) { // createdAt e updatedAt
  //           cell.z = 'dd/mm/yyyy hh:mm:ss';
  //         }
  //       }
  //     }
  //   }

  //   // Aplica estilos à linha de total
  //   const totalCell = worksheet[XLSX.utils.encode_cell({ r: totalRow + 1, c: 7 })];
  //   if (totalCell) {
  //     totalCell.s = {
  //       font: { bold: true },
  //       fill: { fgColor: { rgb: 'F2F2F2' } }, // Cor de fundo cinza claro
  //       numFmt: 'R$ #,##0.00' // Formato de moeda
  //     };
  //   }

  //   // Congela os cabeçalhos
  //   worksheet['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomRight' };

  //   // Autoajusta as colunas
  //   const range = XLSX.utils.decode_range(worksheet['!ref']!);
  //   for (let col = range.s.c; col <= range.e.c; col++) {
  //     let maxWidth = 15; // Largura mínima
  //     for (let row = range.s.r; row <= range.e.r; row++) {
  //       const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
  //       if (cell && cell.v) {
  //         const cellWidth = cell.v.toString().length;
  //         if (cellWidth > maxWidth) {
  //           maxWidth = cellWidth;
  //         }
  //       }
  //     }
  //     worksheet['!cols'] = worksheet['!cols'] || [];
  //     worksheet['!cols'][col] = { wch: maxWidth };
  //   }

  //   // Cria um novo workbook e adiciona a planilha
  //   const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

  //   // Gera o arquivo Excel e faz o download
  //   XLSX.writeFile(workbook, 'relatorio_viagens.xlsx');
  }

  loadTrips() {
    // this.tripService.getTrips().subscribe(
    //   (data) => {
    //     this.viagens = data;
    //     this.filteredViagens = this.viagens;
    //     console.log(data)
    //   },
    //   (err) => {
    //     console.error("Deu error:", err)
    //   }
    // )
  }

  loadReportsSpecific(pacientesId: number) {
    this.reportService.getReports().subscribe({
      next: (res: any) => {
        this.reports = res.reportsFormatados.filter((r: any) => r.pacientes_id === pacientesId);
        // this.reports = res.reportsFormatados
        console.log("Registro da pacientes:", this.reports);
      }
    })
  }

  openpacientes(pacientes: any) {
    console.log(pacientes)
    this.router.navigate(['/trip', pacientes[0].id])
  }

  openpacientesMobile(pacientes: any) {
    console.log(pacientes)
    this.router.navigate(['/trip', pacientes.id])
  }

  openFilter() {
    this.filter = !this.filter
  }

  createTrip() {
    this.dialogCreateReports.showDialog()
  }





  toggleFilter(filter: string) {
    const index = this.selectedFilters.indexOf(filter);
    if (index === -1) {
      this.selectedFilters.push(filter);
    } else {
      this.selectedFilters.splice(index, 1);
    }
    this.applyFilters();
  }

  // Atualiza a pesquisa global
  applyFilterGlobal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtrando por:', filterValue); // Verifique no console se o valor está correto

    // // Verifica se a referência da tabela existe antes de tentar filtrar
    // if (this.dt1) {
    //   this.dt1.filterGlobal(filterValue, 'contains');
    // }

    // // Filtra as viagens para exibição na versão mobile
    // if (!filterValue) {
    //   this.filteredViagens = [...this.viagens]; // Restaura a lista original
    //   return;
    // }

    // this.filteredViagens = this.viagens.filter(pacientes =>
    //   pacientes.cliente?.toLowerCase().includes(filterValue) ||
    //   pacientes.origem?.toLowerCase().includes(filterValue) ||
    //   pacientes.destino?.toLowerCase().includes(filterValue) ||
    //   pacientes.status?.toLowerCase().includes(filterValue)
    // );
  }
  // Aplica os filtros e pesquisa à lista de viagens
  applyFilters() {
    // this.filteredViagens = this.viagens.filter(pacientes => {
    //   const matchesSearch = this.searchText
    //     ? Object.values(pacientes).some(value =>
    //       value.toString().toLowerCase().includes(this.searchText.toLowerCase())
    //     )
    //     : true;

    //   const hasStatusFilter = this.selectedFilters.includes('Concluídas') || this.selectedFilters.includes('Em andamento');
    //   const matchesFilters = !hasStatusFilter || this.selectedFilters.some(filter => {
    //     if (filter === 'Concluídas') return pacientes.status === 'Concluída';
    //     if (filter === 'Em andamento') return pacientes.status === 'Em andamento';
    //     return false;
    //   });

    //   return matchesSearch && matchesFilters;
    // });

    // Aplica ordenação após a filtragem
    if (this.selectedFilters.includes('A a Z')) {
      this.filteredViagens.sort((a, b) => a.cliente.localeCompare(b.cliente));
    }
    if (this.selectedFilters.includes('Z a A')) {
      this.filteredViagens.sort((a, b) => b.cliente.localeCompare(a.cliente));
    }
    if (this.selectedFilters.includes('Primeiro até o último')) {
      this.filteredViagens.sort((a, b) => a.id - b.id);
    }
    if (this.selectedFilters.includes('Último até o primeiro')) {
      this.filteredViagens.sort((a, b) => b.id - a.id);
    }
    if (this.selectedFilters.includes('Valores: maior para menor')) {
      this.filteredViagens.sort((a, b) => b.valor - a.valor);
    }
    if (this.selectedFilters.includes('Valores: menor para maior')) {
      this.filteredViagens.sort((a, b) => a.valor - b.valor);
    }
  }



  delete(event: Event, pacientes: any[]) {

    const ids = pacientes.map(v => v.id)

    console.log('pacientes', ids)

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
        this.tripService.deleteTripMultiple(ids).subscribe(
          (res) => {
            this.toastrService.showSucess(`pacientes apagada com sucesso!`)
            window.location.reload();

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


  formatarDinheiro(valor: number | undefined): string {
    if (valor === undefined || valor === null) {
      return "Valor inválido"; // Ou qualquer fallback adequado
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
}