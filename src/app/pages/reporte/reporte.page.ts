import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReportService } from '../../services/report.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  reporte: any[] = [];
  selectedReporte: string = '';
  startDate: string = '';
  endDate: string = '';
  minDate: string = '';
  maxDate: string = '';
  tableHeaders: string[] = [];

  constructor(private reportService: ReportService, private alertController: AlertController,private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.minDate = '2020-01-01';
    this.maxDate = currentDate;
    this.startDate = currentDate;
    this.endDate = currentDate;
  }

  generarReporte() {
    if (!this.startDate || !this.endDate || !this.selectedReporte) {
      this.presentAlert('Error', 'Por favor complete todos los campos.');
      return;
    }

    const rangoFechas = { Rango_Fechas: `Del ${this.startDate} al ${this.endDate}` };

    switch (this.selectedReporte) {
      case 'ventasProducto':
        this.tableHeaders = ['Producto', 'Cantidad Vendida', 'Precio Unitario', 'Total Ventas', 'Fecha Venta'];
        this.reportService.getResumenVentasPorProducto(this.startDate, this.endDate).subscribe(data => {
          this.reporte = data.map((item: any) => ({ ...item, ...rangoFechas }));
        });
        break;
      case 'ventasUsuario':
        this.tableHeaders = ['ID Usuario', 'Email', 'Ventas Realizadas', 'Cantidad Total', 'Total Ventas'];
        this.reportService.getResumenVentasPorUsuario(this.startDate, this.endDate).subscribe(data => {
          this.reporte = data.map((item: any) => ({ ...item, ...rangoFechas }));
        });
        break;
      case 'ventasDetalladas':
        this.tableHeaders = ['ID Venta', 'ID Usuario', 'Email', 'Fecha Venta', 'Producto', 'Cantidad', 'Precio Unitario', 'Total Venta'];
        this.reportService.getVentasDetalladasPorPeriodo(this.startDate, this.endDate).subscribe(data => {
          this.reporte = data.map((item: any) => ({ ...item, ...rangoFechas }));
        });
        break;
      case 'ventasTotales':
        this.tableHeaders = ['Total Ventas'];
        this.reportService.getVentasTotalesPorPeriodo(this.startDate, this.endDate).subscribe(data => {
          this.reporte = data.map((item: any) => ({ ...item, ...rangoFechas }));
        });
        break;
    }
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reporte);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'reporte_ventas');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
