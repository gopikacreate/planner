import React, { useState } from "react";

export default function AttributeTable({ columns, rows, updateCell, addRow, addColumn, deleteRow, deleteColumn }) {
  const [newColumn, setNewColumn] = useState("");

  return (
    <div>
      {/* Add Column Input */}
      <div className="column-input">
        <input
          type="text"
          placeholder="New column name"
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
        />
        <button className="add-column-btn" onClick={() => {
          addColumn(newColumn);
          setNewColumn("");
        }}>
          Add Column
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="items-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  {col}
                  <button onClick={() => deleteColumn(col)} title="Delete Column">🗑️</button>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.toLowerCase().includes("link") && row[col] ? (
                      <a href={row[col]} target="_blank" rel="noopener noreferrer">
                        {row[col]}
                      </a>
                    ) : (
                      <input
                        type="text"
                        value={row[col]}
                        onChange={(e) => updateCell(rowIndex, col, e.target.value)}
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button onClick={() => deleteRow(rowIndex)}>Delete Row</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-column-btn" onClick={addRow}>
        Add Row
      </button>
    </div>
  );
}
