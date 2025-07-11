import { OptionType } from "@/component/textField/autoCompleteText";

export interface TableRow {
  id: string;
  kode_akun: string;
  nama_akun: string;
  indent_num: number;
  is_header: boolean;
  selectedAkun: OptionType[];
  formula: string | null;
} 