import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";

const DataTable = ({
  data,
  columns,
  hiddenColumns,
  onRowClick,
  width_pct = 50,
  decimalPlaces = 0,
}) => {
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

  const isNumeric = (value) =>
    typeof value === "number" || (!isNaN(value) && value !== "");

  const imageCellRenderer = (params) => {
    if (!params.value) return null;
    return (
      <img
        src={params.value}
        alt="Thumbnail"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    );
  };

  const getDefaultValueFormatter = (fieldName) => {
    const sampleValue = data?.find((row) => row[fieldName] != null)?.[fieldName];
    if (isNumeric(sampleValue)) {
      return (params) =>
        params.value != null
          ? Number(params.value).toLocaleString(undefined, {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            })
          : "";
    }
    return undefined;
  };

  const baseColumnDefs = columns
  ? columns.map((col) => {
      const sampleValue = data?.find((row) => row[col.field] != null)?.[col.field];
      const isNumericField = isNumeric(sampleValue);

      return {
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
          col.valueFormatter ??
          (col.field !== "image" ? getDefaultValueFormatter(col.field) : undefined),
        cellStyle: isNumericField ? { textAlign: "right" } : undefined,
      };
    })
  : Object.keys(data[0] || {}).map((key) => {
      const sampleValue = data?.find((row) => row[key] != null)?.[key];
      const isNumericField = isNumeric(sampleValue);

      return {
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
          key !== "image" ? getDefaultValueFormatter(key) : undefined,
        cellStyle: isNumericField ? { textAlign: "right" } : undefined,
      };
    });

  const columnDefs = hiddenColumns?.length
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