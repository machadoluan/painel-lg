import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { pacientes } from '../../types/models.type';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViagensService } from '../../service/viagens.service';
import { DatePickerModule } from 'primeng/datepicker';
import { ReportsService } from '../../service/reports.service';
import { ToastrService } from '../../service/toastr.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-create-report',
  imports: [DialogModule, InputTextModule, TextareaModule, SelectModule, CommonModule, RouterLink, ProgressSpinner, ReactiveFormsModule, DatePickerModule, NgxMatTimepickerModule, NgxMaskDirective],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.scss'
})
export class CreateReportComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('timepicker') timepicker: any;

  display: boolean = false;
  isLoading = false;
  viagens: pacientes[] = [];
  dadosReport: FormGroup
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
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  fullScreenImageUrl: string | null = null;



  constructor(private fb: FormBuilder, private tripService: ViagensService, private repotService: ReportsService, private toastrService: ToastrService, private authService: AuthService) {
    this.dadosReport = this.fb.group({
      pacientes: ["", Validators.required],
      tipo: ["", Validators.required],
      data: ["", Validators.required],
      hora: ["", Validators.required],
      descricao: [""]
    })
  }

  pacientes: any
  user: any

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken()

    this.loadTrips()
  }

  ngAfterViewInit(): void {
    const inputs = ['data'];

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

  loadTrips() {
   
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }



  openFullScreenImage(imageUrl: string): void {
    this.fullScreenImageUrl = imageUrl; // Exibe a imagem em tela cheia
  }

  closeFullScreenImage(): void {
    this.fullScreenImageUrl = null; // Fecha a imagem em tela cheia
  }

  onFilesSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files) {
      const files = Array.from(fileInput.files);

      console.log('Arquivos selecionados:', files);

      files.forEach(file => {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.imagePreviews.push(base64String);
        };
        reader.readAsDataURL(file);
      });
    }

    this.fileInput.nativeElement.value = '';
  }

  createReport() {
    // console.log("Dados antes ", this.dadosReport.value)
    // const id = this.dadosReport.value.pacientes.id

    // const dadosFormatados = {
    //   data: this.formatarData(this.dadosReport.value.data),
    //   tipo: this.dadosReport.value.tipo.Tipo,
    //   descricao: this.dadosReport.value.descricao,
    //   hora: this.formatarHora(this.dadosReport.value.hora)
    // };

    // this.isLoading = true
    // this.repotService.createReport(id, dadosFormatados, this.selectedFiles, this.user).subscribe({
    //   next: (res) => {
    //     console.log(res)
    //     this.toastrService.showSucess(`Registro de ${dadosFormatados.tipo} criado. `)
    //     this.dadosReport.reset();
    //     this.selectedFiles = []
    //   },
    //   error: (err) => {
    //     console.error(err)
    //     this.toastrService.showError(`Erro ao cadastrar o registro, tente novamente mais tarde. `)
    //     this.isLoading = false
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //   }
    // })

  }

  private formatarHora(hora: string): string {
    if (!hora) return ''; // Verifica se a string está vazia ou indefinida

    // Caso a hora já esteja no formato "HH:mm:ss"
    if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) {
      const partes = hora.split(':');
      return partes[2] === '00' ? `${partes[0]}:${partes[1]}` : hora;
    }

    // Caso a hora seja enviada sem separadores e tenha 4 caracteres (ex: "1420")
    if (/^\d{4}$/.test(hora)) {
      return `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;
    }

    return hora; // Se não atender nenhum caso, retorna como está
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



  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove o arquivo do array de arquivos selecionados
    this.imagePreviews.splice(index, 1); // Remove a pré-visualização correspondente do array de pré-visualizações

    this.fileInput.nativeElement.value = '';

    console.log(this.selectedFiles.length)
  }

  onTimeSelected(time: string) {
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    this.dadosReport.patchValue({ hora: formattedTime });
  }
  
}
