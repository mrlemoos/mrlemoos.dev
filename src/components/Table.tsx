import { ReactElement, HTMLAttributes, ReactNode } from 'react';

import Text from './Text';

import concat from '../util/concat';

// MARK: - Types
type HTMLTableElementAttributes = HTMLAttributes<HTMLTableElement>;

export interface TableColumnSource<TTableData> {
  id: string;
  render: (value: TTableData) => ReactNode;
  label: ReactNode;
}

export interface TableProps<TTableData> extends HTMLTableElementAttributes {
  children?: never;

  columns: TableColumnSource<TTableData>[];
  data: TTableData[];
}

// MARK: - Constants
const classes = {
  root: 'mrl-table',
  tableRoot: 'mrl-table__root',
  tableRow: 'mrl-table__row',
  tableCell: 'mrl-table__cell w-72 border-1 border-gray-200 p-2',
  tableHead: 'mrl-table__head',
  tableBody: 'mrl-table__body',
};

// MARK: - JSX
function Table<TTableData>({ columns, data, className, ...attributes }: TableProps<TTableData>): ReactElement {
  return (
    <div className={concat(classes.root, className, 'p-4 rounded-md max-w-fit')}>
      <table className={classes.tableRoot} {...attributes}>
        <thead className={classes.tableHead}>
          <tr className={classes.tableRow}>
            {columns.map(({ id, label }) => (
              <th key={`head-${id}`} className={classes.tableCell}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={concat(classes.tableBody, 'max-h-[90%] overflow-auto')}>
          {data.map((row) => {
            const renderKey = JSON.stringify(row);
            const zebraStripe = data.indexOf(row) % 2 === 0 ? 'bg-gray-50' : '';

            return (
              <tr key={renderKey} className={concat(classes.tableRow, zebraStripe)}>
                {columns.map(({ render, id }) => {
                  const cellValue = render(row);

                  return (
                    <td key={id} className={classes.tableCell}>
                      {typeof cellValue === 'string' ? <Text>{cellValue}</Text> : cellValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
