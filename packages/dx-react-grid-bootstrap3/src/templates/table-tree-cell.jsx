import React from 'react';
import PropTypes from 'prop-types';

export const TableTreeCell = ({ style, expanded, toggleExpanded, level, hasChildren, column, value }) => (
  <td
    style={{
      ...hasChildren ? { cursor: 'pointer' } : {},
      ...style,
    }}
    {
      ...hasChildren ? {
        onClick: (e) => {
          e.stopPropagation();
          toggleExpanded();
        },
      } : {}
    }
  >
    {[...Array(level)].map((_, index) => (<span key={index} style={{ marginLeft: 20 }}></span>))}
    {hasChildren && <i
      className={`glyphicon glyphicon-triangle-${expanded ? 'bottom' : 'right'}`}
      style={{
        fontSize: '9px',
        top: '0',
      }}
    />}
    {!hasChildren && <span style={{ width: 9, display: 'inline-block' }} />}
    <span style={{ marginLeft: 10 }}>{value}</span>
  </td>
);

TableTreeCell.propTypes = {
  style: PropTypes.shape(),
  expanded: PropTypes.bool,
  toggleExpanded: PropTypes.func,
};

TableTreeCell.defaultProps = {
  style: null,
  expanded: false,
  toggleExpanded: () => {},
};
