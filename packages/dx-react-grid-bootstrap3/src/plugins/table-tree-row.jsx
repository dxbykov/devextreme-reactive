import React from 'react';
import { TableTree as TableTreeBase } from '@devexpress/dx-react-grid';
import { TableTreeCell } from '../templates/table-tree-cell';

const treeCellTemplate = props => <TableTreeCell {...props} />;

export const TableTree = props => (
  <TableTreeBase
    treeCellTemplate={treeCellTemplate}
    {...props}
  />
);
