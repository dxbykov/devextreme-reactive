import React from 'react';
import PropTypes from 'prop-types';
import { Getter, Template, PluginContainer } from '@devexpress/dx-react-core';
import {
  isDetailRowExpanded,
  isDataTableCell,
} from '@devexpress/dx-grid-core';

const pluginDependencies = [
  { pluginName: 'TableView' },
];

export const tableRowsWithExpandedNodes = (tableRows, expandedRows, rowHasChildren, getRowChildren) => {
  let result = tableRows;
  expandedRows
    .forEach((expandedRowId) => {
      const rowIndex = result.findIndex(tableRow =>
        tableRow.type === 'data' && tableRow.rowId === expandedRowId);
      if (rowIndex === -1) return;
      const insertIndex = rowIndex + 1;
      const tableRow = result[rowIndex];
      const { row, rowId } = tableRow;
      if (rowHasChildren(row)) {
        result = [
          ...result.slice(0, insertIndex),
          ...getRowChildren(row).map((childRow, index) => (
            {
              level: (tableRow.level || 0) + 1,
              key: `data_${rowId}_i${index}`,
              type: 'data',
              rowId: `${rowId}_i${index}`,
              row: childRow,
            }
          )),
          ...result.slice(insertIndex),
        ];
      }
    });
  return result;
};

export const tableColumnsWithTree = (tableColumns, treeColumnName) => [
  ...tableColumns.map((tableColumn) => {
    if (treeColumnName && tableColumn.column.name === treeColumnName) {
      return { ...tableColumn, isTree: true }; // type="tree" breaks other plugins (header, editing, etc)
    }
    return tableColumn;
  }),
];

export const isTreeDataCell = (tableRow, tableColumn) =>
  tableRow.type === 'data' && tableColumn.isTree;

export class TableTree extends React.PureComponent {
  render() {
    const {
      treeColumnName,
      rowHasChildren,
      getRowChildren,
      treeCellTemplate,
    } = this.props;

    const tableColumnsComputed = ({ tableColumns }) =>
      tableColumnsWithTree(tableColumns, treeColumnName);

    const tableBodyRowsComputed = ({ tableBodyRows, expandedRows }) =>
      tableRowsWithExpandedNodes(tableBodyRows, expandedRows, rowHasChildren, getRowChildren);

    return (
      <PluginContainer
        pluginName="TableTree"
        dependencies={pluginDependencies}
      >
        <Getter name="tableColumns" computed={tableColumnsComputed} />
        <Template
          name="tableViewCell"
          predicate={({ tableRow, tableColumn }) => isTreeDataCell(tableRow, tableColumn)}
          connectGetters={getter => ({
            getCellData: getter('getCellData'),
            expandedRows: getter('expandedRows'),
          })}
          connectActions={action => ({
            setDetailRowExpanded: action('setDetailRowExpanded'),
          })}
        >
          {({ getCellData, expandedRows, setDetailRowExpanded, ...restParams }) => treeCellTemplate({
            ...restParams,
            row: restParams.tableRow.row,
            column: restParams.tableColumn.column,
            level: restParams.tableRow.level || 0,
            hasChildren: restParams.tableRow.row.children && restParams.tableRow.row.children.length,
            value: getCellData(restParams.tableRow.row, restParams.tableColumn.column.name),
            expanded: isDetailRowExpanded(expandedRows, restParams.tableRow.rowId),
            toggleExpanded: () => setDetailRowExpanded({ rowId: restParams.tableRow.rowId }),
          })}
        </Template>


        <Getter name="tableBodyRows" computed={tableBodyRowsComputed} />

      </PluginContainer>
    );
  }
}

TableTree.propTypes = {
  treeCellTemplate: PropTypes.func.isRequired,
};

TableTree.defaultProps = {
};
