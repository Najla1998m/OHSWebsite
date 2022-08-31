import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { PdfmakeService } from 'ng-pdf-make';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(public pdfmake: PdfmakeService) {}
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
      Workbook: {
        Views: [{ RTL: true }],
      },
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  public SaveAsPDF() {
    this.pdfmake.create();

    // Configure text styles
    this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });

    // Add a text with style
    this.pdfmake.addText('This is a header, using header style', 'header');

    // Add a text with custom style
    this.pdfmake.addText('This is a header, using a custom style', {
      fontSize: 16,
      bold: true,
    });

    // Add simple text
    this.pdfmake.addText('This is an sample PDF printed with pdfMake');

    // Add large text
    this.pdfmake.addText(
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    );

    // Array with colums
    const columns = [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.',
    ];

    // Add columns
    this.pdfmake.addColumns(columns);

    // List to add
    const list1 = ['item 1', 'item 2', 'item 3'];
    const list2 = ['item 1', 'item 2', 'item 3'];
    const list3 = ['item 1', 'item 2', 'item 3'];
    const list4 = ['item 1', 'item 2', 'item 3'];

    // Adding unordered list
    this.pdfmake.addUnorderedlist(list1);

    // Adding ordered list
    this.pdfmake.addOrderedList(list2);

    // Adding reversed oredered list
    this.pdfmake.addOrderedList(list3, true);

    // Adding ordered list starting at 50
    this.pdfmake.addOrderedList(list4, false, 50);

    // Add image from url
    this.pdfmake.addImage(
      'http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png'
    );

    // Add image from url using custom width and height.
    this.pdfmake.addImage(
      'http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
      300,
      150
    );

    // Add image from localhost and using width
    this.pdfmake.addImage('http://localhost:4200/assets/daniel.jpg', 200);

    this.pdfmake.download('test');
  }
}
