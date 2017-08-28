import React from 'react';
import PropTypes from 'prop-types';
import { Getter, Action, PluginContainer } from '@devexpress/dx-react-core';
import { setDetailRowExpanded } from '@devexpress/dx-grid-core';

export class TreeListState extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expandedRows: props.defaultExpandedRows || [],
    };

    this._setDetailRowExpanded = ({ rowId }) => {
      const prevExpandedDetails = this.props.expandedRows || this.state.expandedRows;
      const expandedRows = setDetailRowExpanded(prevExpandedDetails, { rowId });
      const { onExpandedRowsChange } = this.props;
      this.setState({ expandedRows });
      if (onExpandedRowsChange) {
        onExpandedRowsChange(expandedRows);
      }
    };
  }

  render() {
    const expandedRows = this.props.expandedRows || this.state.expandedRows;
    return (
      <PluginContainer
        pluginName="RowDetailState"
      >
        <Action
          name="setDetailRowExpanded"
          action={({ rowId }) => this._setDetailRowExpanded({ rowId })}
        />

        <Getter name="expandedRows" value={expandedRows} />
      </PluginContainer>
    );
  }
}

TreeListState.propTypes = {
  expandedRows: PropTypes.array,
  defaultExpandedRows: PropTypes.array,
  onExpandedRowsChange: PropTypes.func,
};

TreeListState.defaultProps = {
  expandedRows: undefined,
  defaultExpandedRows: undefined,
  onExpandedRowsChange: undefined,
};
