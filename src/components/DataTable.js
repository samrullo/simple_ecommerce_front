import { AgGridReact } from "ag-grid-react";
import React, { useEffect } from "react";
import { useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";

const DataTable = ({ data, hiddenColumns, onRowClick, width_pct }) => {
  if (!width_pct) {
    width_pct = 50;
  }
  const [rowData, setRowData] = useState(data);

  useEffect(() => {
    setRowData(data);
  }, [data]);

  const handleFilterChange = (event) => {
    const { column, filter } = event;

    if (filter) {
      const filterValue = filter.toLowerCase();

      const filteredRows = data.filter((row) =>
        row[column.field].toString().toLowerCase().includes(filterValue)
      );

      setRowData(filteredRows);
    } else {
      setRowData(data);
    }
  };

  const allColumnDefs = Object.keys(data[0]).map((columnKey) => ({
    field: columnKey,
    headerName: columnKey,
    valueFormatter: (params) =>
      params.value ? params.value.toLocaleString() : null,
    sortable: true,
    filter: true,
    filterParams: {
      filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      suppressAndOrCondition: true,
    },
  }));

  const myHiddenColumns = hiddenColumns || [];
  //console.log(`myHiddenColumns are ${myHiddenColumns}`)
  const columnDefs = allColumnDefs.map((columnDef) => {
    if (myHiddenColumns.includes(columnDef.field)) {
      return { ...columnDef, hide: true };
    } else {
      return columnDef;
    }
  });

  return (
    <div className="container mt-5">
      <div
        className="ag-theme-material"
        style={{ height: "400px", width: `${width_pct}%` }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          onFilterChanged={handleFilterChange}
          onRowClicked={onRowClick}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default DataTable;
