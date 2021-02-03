import PropTypes from 'prop-types';
import { useLayoutEffect } from 'react';
import { Table as BootstrapTable } from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import { Checkbox } from './Checkbox';
import { Box } from './Box';
import { uniqueId } from 'lodash';

const Header = ({ getToggleAllRowsSelectedProps }) => {
  const { checked, onChange } = getToggleAllRowsSelectedProps();
  return (
    <Checkbox
      id={uniqueId('checkbox-')}
      checked={checked}
      onToggle={onChange}
    />
  );
};

Header.propTypes = {
  getToggleAllRowsSelectedProps: PropTypes.func,
};

const Cell = ({ row }) => {
  const { checked, onChange } = row.getToggleRowSelectedProps();

  return (
    <Checkbox
      id={uniqueId('checkbox-')}
      checked={checked}
      onToggle={onChange}
    />
  );
};

Cell.propTypes = {
  row: PropTypes.object,
};

const SelectionTable = ({ columns, data, onSelectionChanged }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable({ columns, data }, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: 'selection',
        Header,
        Cell,
      },
      ...columns,
    ]);
  });

  useLayoutEffect(() => {
    if (!onSelectionChanged || !selectedFlatRows) return;
    onSelectionChanged(selectedFlatRows.map((row) => row.values));
  }, [onSelectionChanged, selectedFlatRows]);

  return (
    <Box as={BootstrapTable} {...getTableProps()} striped bordered hover>
      <thead>
        {headerGroups.map((headerGroup, indexHeaderGroup) => (
          <tr key={indexHeaderGroup} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, indexHeader) => (
              <Box
                as="th"
                key={indexHeader}
                {...column.getHeaderProps()}
                fontWeight={700}
              >
                {column.render('Header')}
              </Box>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, indexRow) => {
          prepareRow(row);
          return (
            <tr key={indexRow} {...row.getRowProps()}>
              {row.cells.map((cell, indexCell) => {
                return (
                  <td key={indexCell} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Box>
  );
};

SelectionTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onSelectionChanged: PropTypes.function,
};

export { SelectionTable };
