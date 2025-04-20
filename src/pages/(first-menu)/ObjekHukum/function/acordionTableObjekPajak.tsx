import React, { useState, ReactNode, useEffect } from "react";
import styles from "./styles.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Props } from "../model/objekHukumModel";

const ObjekPajakAccordion: React.FC<Props> = ({ data }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Inisialisasi checked items dari props data
  useEffect(() => {
    const initialChecked: Record<string, boolean> = {};
    data.forEach((induk) => {
      induk.subData?.forEach((sub) => {
        sub.detail?.forEach((detail) => {
          if (detail.checked) {
            initialChecked[detail.kodeObjek] = true;
          }
        });
      });
    });
    setCheckedItems(initialChecked);
  }, [data]);

  const toggleCheck = (kode: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [kode]: !prev[kode],
    }));
  };

  return (
    <div className={styles.container}>
      {data.map((induk) => (
        <AccordionItem
          key={induk.kodeObjek}
          title={`${induk.kodeObjek} - ${induk.namaObjek}`}
        >
          {induk.subData?.map((sub) => (
            <AccordionItem
              key={sub.kodeObjek}
              title={`${sub.kodeObjek} - ${sub.namaObjek}`}
              indent
            >
              {sub.detail?.map((detail) => (
                <div key={detail.kodeObjek} className={styles.detailRow}>
                  <input
                    type="checkbox"
                    checked={!!checkedItems[detail.kodeObjek]}
                    onChange={() => toggleCheck(detail.kodeObjek)}
                  />
                  <span>{`${detail.kodeObjek} - ${detail.namaObjek}`}</span>
                </div>
              ))}
            </AccordionItem>
          ))}
        </AccordionItem>
      ))}
    </div>
  );
};

export default ObjekPajakAccordion;

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  indent?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  indent = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={styles.accordionItem}>
      <div
        onClick={() => setOpen(!open)}
        className={`${styles.accordionHeader} ${
          indent ? styles.subHeader : styles.normalHeader
        }`}
      >
        {open ? <ExpandMoreIcon /> : <ChevronRightIcon />} {title}
      </div>
      {open && <div>{children}</div>}
    </div>
  );
};
