import React from 'react';
import {
  TreeListState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableView,
  TableHeaderRow,
  TableTree,
} from '@devexpress/dx-react-grid-bootstrap3';

import {
  generateRows,
} from '../../demo-data/generator';

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'sex', title: 'Sex' },
        { name: 'city', title: 'City' },
        { name: 'car', title: 'Car' },
      ],
      rows: generateRows({ length: 7 })
        .map(row => ({
          ...row,
          children: generateRows({ length: 3 })
            .map(childRow => ({
              ...childRow,
              children: generateRows({ length: 3 }),
            })),
        })),
    };

    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
    this.rowTemplate = ({ row }) => <div>Details for {row.name} from {row.city}</div>;
  }
  render() {
    const { rows, columns } = this.state;

    return (
      <Grid
        rows={rows}
        columns={columns}
      >
        <TreeListState />
        <TableView />
        <TableHeaderRow />
        <TableTree
          treeColumnName="name"
          rowHasChildren={row => row.children && row.children.length}
          getRowChildren={row => row.children}
        />
      </Grid>
    );
  }
}
