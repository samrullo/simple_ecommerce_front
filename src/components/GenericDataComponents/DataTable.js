import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

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
    timezone = "Asia/Tokyo",
}) => {
    const [rowData, setRowData] = useState(Array.isArray(data) ? data : []);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        filterRows(searchQuery);
    }, [data, searchQuery]);

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

    const linkCellRenderer = (params) => {
        const label = params.colDef.cellRendererParams?.label || "View";
        const className = params.colDef.cellRendererParams?.className || "btn btn-link";
        const linkTo = params.colDef.cellRendererParams?.linkTo;
        const path = typeof linkTo === "function" ? linkTo(params.data) : linkTo;
        return (
            <Link to={path} className={className} onClick={(e) => e.stopPropagation()}>
                {label}
            </Link>
        );
    };

    const getDefaultValueFormatter = (fieldName, fieldType) => {
        const sampleValue = data?.find((row) => row[fieldName] != null)?.[fieldName];

        if (fieldType === "datetime") {
            return (params) =>
                params.value
                    ? moment.utc(params.value).tz(timezone).format("YYYY-MM-DD HH:mm:ss")
                    : "";
        }

        if (fieldType === "numeric" || isNumeric(sampleValue)) {
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
            const fieldType = col.fieldType || null;

            return {
                ...col,
                sortable: true,
                filter: fieldType !== "image",
                filterParams: defaultFilterParams,
                ...(fieldType === "image" && {
                    cellRenderer: imageCellRenderer,
                    filter: false,
                }),
                ...(fieldType === "link" && {
                    cellRenderer: linkCellRenderer,
                    filter: false,
                    sortable: false,
                }),
                valueFormatter:
                    col.valueFormatter ??
                    (fieldType !== "image" ? getDefaultValueFormatter(col.field, fieldType) : undefined),
                cellStyle:
                    fieldType === "numeric" || isNumeric(sampleValue)
                        ? { textAlign: "right" }
                        : undefined,
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
                }),
                valueFormatter:
                    key !== "image" ? getDefaultValueFormatter(key, null) : undefined,
                cellStyle: isNumericField ? { textAlign: "right" } : undefined,
            };
        });

    const columnDefs = hiddenColumns?.length
        ? baseColumnDefs.map((col) =>
            hiddenColumns.includes(col.field) ? { ...col, hide: true } : col
        )
        : baseColumnDefs;

    const filterRows = (query) => {
        if (!query) {
            setRowData(Array.isArray(data) ? data : []);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = data.filter((row) =>
            columns.some((col) => {
                const fieldType = col.fieldType || null;
                if (fieldType === "image" || fieldType === "numeric" || fieldType === "datetime") return false;
                const value = row[col.field];
                return typeof value === "string" && value.toLowerCase().includes(lowerQuery);
            })
        );
        setRowData(filtered);
    };

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search text fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div
                className="ag-theme-material"
                style={{ height: "400px", width: `${width_pct}%` }}
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowClicked={onRowClick}
                    enableCellTextSelection={true}
                    enableClipboard={true}
                    domLayout="autoHeight"
                    tooltipShowDelay={300}
                />
            </div>
        </div>
    );
};

export default DataTable;