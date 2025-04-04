export const TableStyles = {
  table: {
    width: "100%",
    maxHeight: "95%",
    backgroundColor: "var(--item-bg-color)",
    color: "var(--text-color)",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "var(--scrollbar-track-color)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "var(--scrollbar-thumb-color)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "var(--scrollbar-thumb-hover-color)",
    },
  },
  tableRow: {
    backgroundColor: "var(--item-bg-color)",
    ":hover": {
      backgroundColor: "var(--item-hover-bg-color)",
    },
  },
  tableHeaderCell: {
    backgroundColor: "var(--barra-bg-color)",
    color: "var(--barra-text-color)",
    cursor: "pointer",
    textAlign: "center",
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
    cursor: "default",
    textAlign: "center",
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
  tablePaginationSlots: {
    menuItem: {
      sx: {
        fontSize: "0.7rem",
      },
    },
    select: {
      sx: {
        fontSize: "0.7rem",
      },
    },
  },
};
