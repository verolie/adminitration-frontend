import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { API_BASE_URL } from '@/utils/config';

export async function exportGenerateLaporanLabaRugiExcel(
  companyId: string,
  token: string,
  startDate?: string,
  endDate?: string,
  dataOverride?: any[]
) {
  let data = dataOverride;
  if (!dataOverride) {
    // Build query string for start_date and end_date
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    const url = `${API_BASE_URL}/laporan-laba-rugi/${companyId}/generate_laporan` + (query.toString() ? `?${query.toString()}` : '');

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    data = result.data || [];
  }
  data = data || [];

  // Header dan sub-header sesuai GenerateLaporanLabaRugi
  const headerRow = [
    'Kode Akun',
    'Nama Akun',
    'Nilai (Komersial)',
    'Tidak Termasuk Objek Pajak',
    'Dikenakan PPh Bersifat Final',
    'Objek Pajak Tidak Final',
    'Penyesuaian Fiskal Positif',
    'Penyesuaian Fiskal Negatif',
    'Kode Penyesuaian Fiskal',
    'Nilai Fiskal (Sebelum Fasilitas Perpajakan)',
  ];
  const subHeaderRow = [
    '(1)', '(2)', '(3)', '(4)', '(5)', '(6) = (3)-(4)-(5)', '(7)', '(8)', '(9)', '(10)'
  ];
  const colFieldMap = [
    'kode_akun',
    'nama_akun',
    'nilai_komersial',
    'tidak_termasuk_objek_pajak',
    'dikenakan_pph_bersifat_final',
    'objek_pajak_tidak_final',
    'penyesuaian_fiskal_positif',
    'penyesuaian_fiskal_negatif',
    'kode_penyesuaian_fiskal',
    'nilai_fiskal',
  ];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Laporan Laba Rugi');
  worksheet.addRow(headerRow);
  const subHeader = worksheet.addRow(subHeaderRow);
  subHeader.eachCell((cell) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Style abu-abu
  const greyFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF0F0F0' } };

  // Data rows
  data.forEach((row: any) => {
    const arr = colFieldMap.map((field) => row[field] ?? '');
    const excelRow = worksheet.addRow(arr);
    arr.forEach((val, idx) => {
      // Kolom 0 dan 1 (kode_akun, nama_akun) tidak pernah grey
      if (idx > 1 && (val === null || val === '')) {
        excelRow.getCell(idx + 1).fill = greyFill;
      }
    });
  });

  // Auto width
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

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'Laporan_Laba_Rugi.xlsx');
}
