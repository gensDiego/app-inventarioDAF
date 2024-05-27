import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  stocks: any[] = [];
  selectedFile: File | null = null;

  constructor(private stockService: AuthService, private alertController: AlertController) {}

  ngOnInit() {
    this.getStock();
  }

  getStock() {
    this.stockService.getStock().subscribe(data => {
      console.log(data);
      this.stocks = data;
    });
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.stocks);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'stock_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  downloadTemplate() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const headers = [
      ['ID_Local', 'Fecha_Actualizacion', 'Cantidad', 'ID_Producto', 'Nombre', 'SKU', 'Marca', 'ID_Categoria', 'Precio'],
      ['', currentDate, '', '', '', '', '', '', '']
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Plantilla_Stock');
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      this.presentAlert('Error', 'No puedes subir múltiples archivos');
      return;
    }
    this.selectedFile = target.files[0];

    // Leer el archivo seleccionado y convertirlo a JSON
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryString: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

      const worksheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log('Datos convertidos a JSON:', data); // Mostrar el JSON en la consola

      this.uploadStock(data); // Llamar a la función para subir el stock
    };
    reader.readAsBinaryString(this.selectedFile);
  }

  uploadStock(data: any) {
    this.stockService.uploadStock(data).subscribe(
      () => {
        this.presentAlert('Éxito', 'Datos de stock subidos correctamente');
        this.getStock(); // Opcional: actualizar la lista de stock después de subir
      },
      error => {
        this.presentAlert('Error', 'Hubo un problema al subir el archivo');
        console.error(error);
      }
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
