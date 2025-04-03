import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { pacientes, registro } from '../../types/models.type';
import { Table, TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { Router, RouterLink } from '@angular/router';
import { ReportsService } from '../../service/reports.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from '../../service/toastr.service';
import { Tag } from 'primeng/tag';

import { ConfirmDialog } from 'primeng/confirmdialog';



@Component({
  selector: 'app-reports',
  imports: [InputIcon, IconField, InputTextModule, TableModule, CommonModule, DialogModule, SelectButtonModule, FormsModule, OverlayBadgeModule, CreateReportsComponent, RouterLink, Tag],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild(CreateReportsComponent, { static: true }) dialogCreateReports!: CreateReportsComponent;
  @ViewChild('dt1') dt1!: Table;
  displayDialog: boolean = false;
  selectedFormat: string = 'pdf';
  exportOptions: any[] = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' }
  ];

  registrosPacientes: pacientes[] = [];
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


  selectedRegistros: any[] = [];
  filteredReports: any[] = [];
  selectedFilters: string[] = [];
  filter: boolean = false
  searchText: string = '';

  constructor(
    private router: Router,
    private reportService: ReportsService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,

    private eRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  fecharFiltro(event: Event) {
    if (this.filter && !this.eRef.nativeElement.contains(event.target)) {
      this.filter = false;
    }
  }

  ngOnInit(): void {
  }



  // getpacientesNome(pacientes_id: number): string {
  //   const pacientes = this.viagens.find(v => v.id === pacientes_id);
  //   return pacientes ? `${pacientes.origem} → ${pacientes.destino}` : 'Desconhecido';
  // }

  showDialog() {
    this.displayDialog = true;
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
    // Lógica para exportar para PDF

    console.log(this.selectedRegistros)

  }

  exportToExcel() {
    console.log('Exportando para Excel...');

    // Verifica se selectedRelatorios está vazio e usa relatorios como fallback
    const dadosExportacao = this.selectedRegistros.length > 0 ? this.selectedRegistros : this.registrosPacientes;

    // Mapeia os dados para substituir pacientes_id pelo nome da pacientes e formata a data e hora
    const dadosComNomepacientes = dadosExportacao.map(registro => ({
      pacientes_nome: registro.pacientes_nome, // Adiciona o nome da pacientes
      tipo: registro.tipo,
      data: this.formatarData(registro.data), // Formata a data
      hora: this.formatarHora(registro.hora), // Formata a hora
      descricao: registro.descricao,
      foto: registro.foto,
    }));



    // Verifica os dados para exportação
    console.log('Dados para exportação:', dadosComNomepacientes);

    // Cria uma planilha vazia
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Adiciona um título na primeira linha
    XLSX.utils.sheet_add_aoa(worksheet, [['Relatório de Início de Jornada']], { origin: 'A1' });

    // Adiciona cabeçalhos personalizados
    XLSX.utils.sheet_add_aoa(worksheet, [['pacientes', 'Tipo', 'Data', 'Hora', 'Descrição', 'Foto']], { origin: 'A2' });

    // Adiciona os dados à planilha
    XLSX.utils.sheet_add_json(worksheet, dadosComNomepacientes, {
      header: ['pacientes_nome', 'tipo', 'data', 'hora', 'descricao', 'foto'], // Usa pacientes_nome no lugar de pacientes_id
      skipHeader: true, // Não adiciona o cabeçalho novamente
      origin: 'A3' // Começa a adicionar os dados a partir da linha 3
    });

    // Mescla células para o título
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Mescla da coluna A até E na primeira linha
    ];

    // Aplica estilos ao título
    const titleCell = worksheet['A1'];
    if (titleCell) {
      titleCell.s = {
        font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: '4F81BD' } } // Cor de fundo azul
      };
    }

    // Aplica estilos aos cabeçalhos
    for (let col = 0; col < 5; col++) {
      const headerCell = worksheet[XLSX.utils.encode_cell({ r: 1, c: col })];
      if (headerCell) {
        headerCell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: '8DB4E2' } } // Cor de fundo azul claro
        };
      }
    }

    // Aplica estilos aos dados
    const totalRow = dadosComNomepacientes.length + 2; // +2 para pular o título e os cabeçalhos
    for (let row = 2; row <= totalRow; row++) {
      for (let col = 0; col < 5; col++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          cell.s = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            },
            alignment: { horizontal: 'center' }
          };
        }
      }
    }

    // Congela os cabeçalhos
    worksheet['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomRight' };

    // Autoajusta as colunas
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 15; // Largura mínima
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
      }
      worksheet['!cols'] = worksheet['!cols'] || [];
      worksheet['!cols'][col] = { wch: maxWidth };
    }

    // Cria um novo workbook e adiciona a planilha
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

    // Gera o arquivo Excel e faz o download
    XLSX.writeFile(workbook, 'relatorio_inicio_jornada.xlsx');
  }

  // Função para formatar a data
  formatarData(data: string): string {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR'); // Formato brasileiro
  }

  // Função para formatar a hora
  formatarHora(hora: string): string {
    const date = new Date(`1970-01-01T${hora}Z`);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Formato brasileiro
  }



  applyFilterGlobal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtrando por:', filterValue); // Verifique no console se o valor está correto

    // Verifica se a referência da tabela existe antes de tentar filtrar
    if (this.dt1) {
      this.dt1.filterGlobal(filterValue, 'contains');
    }

    // Filtra as viagens para exibição na versão mobile
    if (!filterValue) {
      this.filteredReports = [...this.pacientes]; // Restaura a lista original
      return;
    }

    this.filteredReports = this.pacientes.filter(report =>
      report.nomeClinica?.toLowerCase().includes(filterValue) ||
      report.nomeDoutor?.toLowerCase().includes(filterValue) ||
      report.nomePaciente?.toLowerCase().includes(filterValue) ||
      report.sexo?.toLowerCase().includes(filterValue) ||
      report.hora?.toLowerCase().includes(filterValue) ||
      report.email?.toLowerCase().includes(filterValue) ||
      report.dataInicio?.toLowerCase().includes(filterValue) ||
      report.dataFinal?.toLowerCase().includes(filterValue) ||
      report.instrucoes?.toLowerCase().includes(filterValue) ||
      report.status?.toLowerCase().includes(filterValue)
    );


    console.log(this.filteredReports)
  }

  openFilter() {
    this.filter = !this.filter
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

  applyFilters() {
    const today = new Date().toLocaleDateString('pt-BR');
    const searchTextNormalized = this.searchText?.toLowerCase().trim() || '';
  
    this.filteredReports = this.pacientes.filter(registro => {
      const matchesSearch = searchTextNormalized
        ? Object.values(registro).some(value =>
            value?.toString().toLowerCase().includes(searchTextNormalized)
          )
        : true;
  
      const matchesFilters = this.selectedFilters.length === 0 ||
        this.selectedFilters.some(filter => {
          if (filter === 'hoje') return registro.dataInicio === today || registro.dataFinal === today;
          if (filter === 'andamento') return registro.status?.toLowerCase() === 'in progress';
          if (filter === 'finalizados') return ['completed', 'delivered'].includes(registro.status?.toLowerCase());
          if (filter === 'feminino') return registro.sexo?.toLowerCase() === 'feminino';
          if (filter === 'masculino') return registro.sexo?.toLowerCase() === 'masculino';
          if (filter === 'longa-duracao') return registro.previsaoDias > 10;
          return false;
        });
  
      return matchesSearch && matchesFilters;
    });
  
    if (this.filteredReports.length === 0) {
      console.log('Nenhum encontrado');
    }
  }
  



  createReport() {
    this.dialogCreateReports.showDialog()
  }


  openReports(report: any) {
    console.log(report)

    this.router.navigate(['/report', report[0].id])

  }

  openReportsMobile(report: any) {
    this.router.navigate(['/report', report.id])
  }


  delete(event: Event, report: any[]) {

    const ids = report.map(r => r.id)

    console.log('report', ids)

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
        this.reportService.deleteReportMultiple(ids).subscribe(
          (res) => {
            this.toastrService.showSucess(`Registro apagado com sucesso!`)
            window.location.reload();

          },
          (err) => {
            this.toastrService.showError(`Erro ao deletar registro, tente novamente mais tarde!`)

          }
        )

      },
      reject: () => {
      },
    });
  }
}

