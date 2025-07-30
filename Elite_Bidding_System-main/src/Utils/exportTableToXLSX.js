import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportTableToXLSX = (tableId, filename = "export.xlsx") => {
  const table = document.getElementById(tableId);
  if (!table) {
    console.error("Table not found!");
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);
  
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
  // Write file and trigger download
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, filename);
};

export default exportTableToXLSX;
