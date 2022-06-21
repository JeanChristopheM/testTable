// function App() {
//   return <div className="App">HI</div>;
// }

// export default App;

import React, { useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";

import "./style/main.scss";

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useTableInstance,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import Filler from "./Filler";

let table = createTable().setRowType<Person>();

function App() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [data, setData] = React.useState(() => makeData(1000));
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [scrollPos, setScrollPos] = React.useState(null);

  useLayoutEffect(() => {
    if (scrollPos) {
      window.scroll(0, scrollPos);
      console.log("just scrolled to ", scrollPos);
    }
  }, [data, scrollPos]);

  const columns = React.useMemo(
    () => [
      table.createGroup({
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          table.createDataColumn("firstName", {
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          }),
          table.createDataColumn((row) => row.lastName, {
            id: "lastName",
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id,
          }),
        ],
      }),
      table.createGroup({
        header: "Info",
        footer: (props) => props.column.id,
        columns: [
          table.createDataColumn("age", {
            header: () => "Age",
            footer: (props) => props.column.id,
          }),
          table.createGroup({
            header: "More Info",
            columns: [
              table.createDataColumn("visits", {
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id,
              }),
              table.createDataColumn("status", {
                header: "Status",
                footer: (props) => props.column.id,
              }),
              table.createDataColumn("progress", {
                header: "Profile Progress",
                footer: (props) => props.column.id,
              }),
            ],
          }),
        ],
      }),
    ],
    []
  );

  const refreshData = () => {
    setScrollPos(window.scrollY);
    return setData(() => makeData(1000));
  };

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  console.log("%c---RERENDER---", "color: #c3602c");
  return (
    <>
      <Filler />
      <div className="p-2">
        <div className="h-2" />
        <table>
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {header.renderHeader()}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance
              .getRowModel()
              .rows.slice(0, 100)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return <td key={cell.id}>{cell.renderCell()}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div>{instance.getRowModel().rows.length} Rows</div>
        <div>
          <button onClick={() => rerender()}>Force Rerender</button>
        </div>
        <div style={{ position: "fixed", top: "0", right: "0" }}>
          <button onClick={() => refreshData()}>Refresh Data</button>
          <div>{scrollPos}</div>
          <div>{window.scrollY}</div>
        </div>
        <pre>{JSON.stringify(sorting, null, 2)}</pre>
      </div>
      <Filler />
    </>
  );
}

export default App;
