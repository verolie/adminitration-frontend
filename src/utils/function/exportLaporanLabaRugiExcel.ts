import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportLaporanLabaRugiExcel(companyId: string, token: string) {
  const url = `http://127.0.0.1:5000/laporan-laba-rugi/${companyId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  const data = result.data || [];

  // Header and sub-header
  const headerRow = [
    'KODE AKUN',
    'NAMA AKUN',
    'NILAI (KOMERSIAL)',
    'TIDAK TERMASUK OBJ PAJAK',
    'DIKENAKAN PPH BERSIFAT FINAL',
    'OBJEK PAJAK TIDAK FINAL',
    'PENYESUAIAN FISKAL POSITIF',
    'PENYESUAIAN FISKAL NEGATIF',
    'KODE PENYESUAIAN FISKAL',
    'NILAI FISKAL (Sebelum Fasilitas Perpajakan)',
  ];
  const subHeaderRow = [
    '(1)', '(2)', '(3)', '(4)', '(5)', '(6)=(3)-(4)-(5)', '(7)', '(8)', '(9)', '(10)'
  ];

  // Map for KolomLaporanLabaRugi to column index
  const colFieldMap = [
    null, // 0: KODE AKUN
    null, // 1: NAMA AKUN
    'nilai_komersial',
    'tidak_termasuk_objek_pajak',
    'dikenakan_pph_bersifat_final',
    'objek_pajak_tidak_final',
    'penyesuaian_fiskal_positif',
    'penyesuaian_fiskal_negatif',
    'kode_penyesuaian_fiskal',
    'nilai_fiskal',
  ];

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Lampiran 1A');

  // Add header and sub-header
  worksheet.addRow(headerRow);
  const subHeader = worksheet.addRow(subHeaderRow);

  // Center align the sub-header row
  subHeader.eachCell((cell) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Style for grey background
  const greyFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFD9D9D9' } };

  // Add data rows
  data.forEach((row: any) => {
    const arr = [
      row.kode_akun || '',
      row.nama_akun || '',
      '', '', '', '', '', '', '', ''
    ];
    const excelRow = worksheet.addRow(arr);
    const kolom = row.KolomLaporanLabaRugi;
    for (let col = 3; col <= 10; col++) { // ExcelJS columns are 1-based
      let grey = false;
      if (!kolom) {
        grey = true;
      } else {
        const field = colFieldMap[col - 1];
        if (field && kolom[field] === false) grey = true;
      }
      if (grey) {
        excelRow.getCell(col).fill = greyFill;
      }
    }
  });

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
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Lampiran_1A_Laporan_Laba_Rugi.xlsx');
} 