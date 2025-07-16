import React, { useState } from "react";
import styles from "./styles.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface MasterTaxDetail {
  id: number;
  tgl: string;
  is_badan_usaha: boolean;
  persentase: number;
}

interface AkunPerkiraanDetail {
  kode_akun: string;
  nama_akun: string;
}

interface MasterTax {
  id: number;
  kodeObjek: string;
  namaObjek: string;
  deskripsiObjek: string;
  ObjekPajakDetails: MasterTaxDetail[];
  akunPerkiraanDetails?: AkunPerkiraanDetail[];
}

interface AccordionTableMasterTaxProps {
  data: MasterTax[];
}

const AccordionTableMasterTax: React.FC<AccordionTableMasterTaxProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      {data.map((masterTax) => {
        const akunPerkiraan = masterTax.akunPerkiraanDetails && masterTax.akunPerkiraanDetails.length > 0
          ? `${masterTax.akunPerkiraanDetails[0].kode_akun ?? 'null'} - ${masterTax.akunPerkiraanDetails[0].nama_akun ?? 'null'}`
          : 'null';

        const hasDetails = masterTax.ObjekPajakDetails.length > 0;

        return hasDetails ? (
          <AccordionItem 
            key={masterTax.id} 
            title={`${masterTax.kodeObjek} - ${masterTax.namaObjek}`} 
            akunPerkiraan={akunPerkiraan}
            initiallyOpen={true}
          >
            {renderGroupedDetails(masterTax.ObjekPajakDetails)}
          </AccordionItem>
        ) : (
          <div key={masterTax.id} className={styles.nonExpandableItem}>
            <div className={styles.nonExpandableHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{`${masterTax.kodeObjek} - ${masterTax.namaObjek}`}</span>
                {akunPerkiraan !== 'null' && (
                  <span>{`Akun Hutang: ${akunPerkiraan}`}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const renderGroupedDetails = (details: MasterTaxDetail[]) => {
  const groupedDetails = details.reduce((acc, detail) => {
    const key = detail.is_badan_usaha ? "Badan Usaha" : "Non Badan Usaha";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(detail);
    return acc;
  }, {} as Record<string, MasterTaxDetail[]>);

  return Object.entries(groupedDetails).map(([group, items]) => (
    <div key={group}>
      <h4 className={styles.groupTitle}>{group}:</h4>
      {items.map((detail) => (
        <div key={detail.id} className={styles.detailRow}>
          <span>{`Tanggal: ${detail.tgl}`}</span>
          <span>{`Persentase: ${detail.persentase}%`}</span>
        </div>
      ))}
    </div>
  ));
};

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  akunPerkiraan: string; // New prop for account information
  initiallyOpen?: boolean; // New prop to control initial open state
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, akunPerkiraan, initiallyOpen = false }) => {
  const [open, setOpen] = useState<boolean>(initiallyOpen); // Set initial state based on prop

  return (
    <div className={styles.accordionItem}>
      <div onClick={() => setOpen(!open)} className={styles.accordionHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>{title}</span>
          {akunPerkiraan !== 'null' && ( // Only render if akunPerkiraan is not 'null'
            <span>{`Akun Hutang: ${akunPerkiraan}`}</span>
          )}
        </div>
        {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </div>
      {open && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
};

export default AccordionTableMasterTax;
