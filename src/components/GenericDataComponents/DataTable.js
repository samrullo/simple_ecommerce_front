import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";

const DataTable = ({ data, columns, hiddenColumns, onRowClick, width_pct }) => {
  if (!width_pct) width_pct = 50;
  const [rowData, setRowData] = useState(data);

  useEffect(() => {
    setRowData(data);
  }, [data]);

  const handleFilterChange = (event) => {
    const { column, filter } = event;
    if (filter) {
      const filterValue = filter.toLowerCase();
      const filteredRows = data.filter((row) =>
        row[column.field]?.toString().toLowerCase().includes(filterValue)
      );
      setRowData(filteredRows);
    } else {
      setRowData(data);
    }
  };

  const defaultFilterParams = {
    filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    suppressAndOrCondition: true,
  };

  // ⬇️ Custom renderer for image fields
  const imageCellRenderer = (params) => {
    if (!params.value) return null;
    return (
      <img
        src={params.value}
        alt="Thumbnail"
        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
      />
    );
  };

  const baseColumnDefs = columns
    ? columns.map((col) => ({
        ...col,
        sortable: true,
        filter: true,
        filterParams: defaultFilterParams,
        ...(col.field === "image" && {
          cellRenderer: imageCellRenderer,
          filter: false,
          valueFormatter: undefined,
        }),
        valueFormatter:
          col.valueFormatter ||
          (col.field !== "image"
            ? (params) => (params.value ? params.value.toLocaleString() : null)
            : undefined),
      }))
    : Object.keys(data[0] || {}).map((key) => ({
        field: key,
        headerName: key,
        sortable: true,
        filter: true,
        filterParams: defaultFilterParams,
        ...(key === "image" && {
          cellRenderer: imageCellRenderer,
          filter: false,
          valueFormatter: undefined,
        }),
        valueFormatter:
          key !== "image"
            ? (params) => (params.value ? params.value.toLocaleString() : null)
            : undefined,
      }));

  const columnDefs = (hiddenColumns || []).length
    ? baseColumnDefs.map((col) =>
        hiddenColumns.includes(col.field)
          ? { ...col, hide: true }
          : col
      )
    : baseColumnDefs;

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
          enableCellTextSelection={true}
          enableClipboard={true}
        />
      </div>
    </div>
  );
};

export default DataTable;