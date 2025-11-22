import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

type RowData = {
  asset: string;
  exposure: number;
  var: number;
};

export default function RiskTable() {
  const [columnDefs] = useState<ColDef<RowData>[]>([
    { headerName: "Asset", field: "asset" },
    { headerName: "Exposure", field: "exposure" },
    { headerName: "VaR", field: "var" },
  ]);

  const [rowData] = useState<RowData[]>([
    { asset: "AAPL", exposure: 50000, var: 2500 },
    { asset: "GOOG", exposure: 40000, var: 2000 },
    { asset: "TSLA", exposure: 30000, var: 1800 },
  ]);

  return (
    <div
      className="ag-theme-alpine w-full max-w-4xl mx-auto my-16"
      style={{ height: 300 }}
    >
      <AgGridReact<RowData>
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, sortable: true, filter: true }}
      />
    </div>
  );
}
