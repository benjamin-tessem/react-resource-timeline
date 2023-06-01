const TableDividerCell = () => {
  return (
    <td
      role="presentation"
      css={{
        height: "1px",
        cursor: "col-resize",
        width: "3px",
        background: "hsla(0,0%,82%,.3)",
        p: 0,
        border: "1px, solid transparent"
      }}
    />
  );
};

export default TableDividerCell;
