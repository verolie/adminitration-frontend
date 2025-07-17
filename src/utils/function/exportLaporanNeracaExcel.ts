import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { API_BASE_URL } from "@/utils/config";

export async function exportMappingLaporanNeracaExcel(companyId: string, token: string) {
  const url = `${API_BASE_URL}/laporan-neraca/${companyId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  const data = result.data || [];

  // Split data
  const leftData = data.filter((row: any) => row.kode_akun?.startsWith('1'));
  const rightData = data.filter((row: any) => row.kode_akun?.startsWith('2') || row.kode_akun?.startsWith('3'));
  const maxRows = Math.max(leftData.length, rightData.length);

  // Header dan subheader
  const headerRow = ['KODE AKUN', 'NAMA AKUN', 'NILAI'];
  const subHeaderRow = ['(1)', '(2)', '(3)'];

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Lampiran 1B');

  // Tulis header kiri & kanan
  worksheet.getCell('A1').value = 'B. LAPORAN POSISI KEUANGAN';
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').font = { bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };

  worksheet.getCell('A2').value = headerRow[0];
  worksheet.getCell('B2').value = headerRow[1];
  worksheet.getCell('C2').value = headerRow[2];
  worksheet.getCell('E2').value = headerRow[0];
  worksheet.getCell('F2').value = headerRow[1];
  worksheet.getCell('G2').value = headerRow[2];
  worksheet.getRow(2).font = { bold: true };
  worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.getCell('A3').value = subHeaderRow[0];
  worksheet.getCell('B3').value = subHeaderRow[1];
  worksheet.getCell('C3').value = subHeaderRow[2];
  worksheet.getCell('E3').value = subHeaderRow[0];
  worksheet.getCell('F3').value = subHeaderRow[1];
  worksheet.getCell('G3').value = subHeaderRow[2];
  worksheet.getRow(3).alignment = { vertical: 'middle', horizontal: 'center' };

  // Style for grey background
  const greyFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD9D9D9' } };

  // Tulis data baris per baris, kiri dan kanan sejajar
  for (let i = 0; i < maxRows; i++) {
    const left = leftData[i];
    const right = rightData[i];
    const rowIdx = i + 4; // Data mulai baris ke-4

    // Kiri
    if (left) {
      const indent = left.indent_num ? ' '.repeat(left.indent_num * 4) : '';
      worksheet.getCell(`A${rowIdx}`).value = left.kode_akun || '';
      worksheet.getCell(`B${rowIdx}`).value = indent + (left.nama_akun || '');
      worksheet.getCell(`C${rowIdx}`).value = '';
      worksheet.getCell(`A${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getCell(`B${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getCell(`C${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'right' };
      if (left.is_header || left.formula !== null) {
        worksheet.getCell(`A${rowIdx}`).fill = greyFill;
        worksheet.getCell(`B${rowIdx}`).fill = greyFill;
        worksheet.getCell(`C${rowIdx}`).fill = greyFill;
      }
    }
    // Kanan
    if (right) {
      const indent = right.indent_num ? ' '.repeat(right.indent_num * 4) : '';
      worksheet.getCell(`E${rowIdx}`).value = right.kode_akun || '';
      worksheet.getCell(`F${rowIdx}`).value = indent + (right.nama_akun || '');
      worksheet.getCell(`G${rowIdx}`).value = '';
      worksheet.getCell(`E${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getCell(`F${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getCell(`G${rowIdx}`).alignment = { vertical: 'middle', horizontal: 'right' };
      if (right.is_header || right.formula !== null) {
        worksheet.getCell(`E${rowIdx}`).fill = greyFill;
        worksheet.getCell(`F${rowIdx}`).fill = greyFill;
        worksheet.getCell(`G${rowIdx}`).fill = greyFill;
      }
    }
  }

  // Semua border thin
  const startRow = 2;
  const endRow = maxRows + 3;
  // Kiri: kolom A, B, C
  for (let r = startRow; r <= endRow; r++) {
    for (let c = 1; c <= 3; c++) {
      const cell = worksheet.getCell(r, c);
      cell.border = {
        top:    { style: 'thin' },
        bottom: { style: 'thin' },
        left:   { style: 'thin' },
        right:  { style: 'thin' },
      };
    }
  }
  // Kanan: kolom E, F, G
  for (let r = startRow; r <= endRow; r++) {
    for (let c = 5; c <= 7; c++) {
      const cell = worksheet.getCell(r, c);
      cell.border = {
        top:    { style: 'thin' },
        bottom: { style: 'thin' },
        left:   { style: 'thin' },
        right:  { style: 'thin' },
      };
    }
  }

  // Auto width for columns
  worksheet.columns.forEach((column) => {
    let maxLength = 10;
    if (typeof column.eachCell === 'function') {
      column.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
        const val = cell.value ? cell.value.toString() : '';
        if (val.length > maxLength) maxLength = val.length;
      });
      column.width = maxLength + 2;
    }
  });

  // Export to blob and download
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Lampiran_1B_Laporan_Neraca.xlsx');
} 