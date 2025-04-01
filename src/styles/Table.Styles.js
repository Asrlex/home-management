export const TableStyles = {
  tableHeaderCell: {
    backgroundColor: "var(--barra-bg-color)",
    color: "var(--barra-text-color)",
    cursor: "pointer",
    "@media (max-width: 600px)": {
      fontSize: "0.7rem",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      paddingLeft: "0.2rem",
      paddingRight: "0.2rem",
    },
    "@media (min-width: 601px) and (max-width: 900px)": {
      fontSize: "0.9rem",
    },
    "@media (min-width: 901px)": {
      fontSize: "1rem",
    },
  },
  tableCell: {
    color: "var(--product-text-color)",
    fontSize: "1rem",
    "@media (max-width: 600px)": {
      fontSize: "0.7rem",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      paddingLeft: "0.2rem",
      paddingRight: "0.2rem",
    },
    "@media (min-width: 601px) and (max-width: 900px)": {
      fontSize: "0.9rem",
    },
    "@media (min-width: 901px)": {
      fontSize: "1rem",
    },
  },
  tablePagination: {
    backgroundColor: "var(--barra-bg-color)",
    color: "var(--pagination-text-color)",
    "@media (max-width: 600px)": {
      fontSize: "0.7rem",
      "& .MuiTablePagination-selectLabel": {
        fontSize: "0.7rem",
      },
      "& .MuiTablePagination-displayedRows": {
        fontSize: "0.7rem",
      },
      "& .MuiPopover-root": {
        fontSize: "0.7rem",
      },
      "& .MuiSvgIcon-root": {
        fontSize: "0.9rem",
      },
    },
  },
};
