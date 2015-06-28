'use strict';

var React = require('react');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var styles = {
  root: {
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
  },
  rootWithoutMargin: {
    padding: '16px 0',
  },
  left: {
    width: 56,
    flexShrink: 0,
  },
  leftIcon: {
    width: 48,
    paddingLeft: 8,
    flexShrink: 0,
  },
  content: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  right: {
    maxWidth: '45%',
    marginLeft: 16,
    flexShrink: 0,
    wordBreak: 'break-word',
  },
};

var List = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
    withoutMargin: React.PropTypes.bool,
    style: React.PropTypes.object,
  },
  mixins: [
    StylePropable,
  ],
  getDefaultProps: function() {
    return {
      withoutMargin: false,
    };
  },
  onTouchTap: function(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },
  render: function() {
    var props = this.props;
    var left = props.left;
    var leftStyle = styles.left;

    if (left && left.type.displayName === 'ContentAdd') {
      leftStyle = styles.leftIcon;
    }

    var styleRoot = this.mergeAndPrefix(styles.root, props.style);

    if (props.withoutMargin) {
      styleRoot = this.mergeAndPrefix(styleRoot, styles.rootWithoutMargin);
    }

    return <div style={styleRoot} onTouchTap={this.onTouchTap} className="testList">
      <div style={leftStyle}>{props.left}</div>
      <div style={styles.content}>
        {props.children}
      </div>
      <div style={styles.right}>{props.right}</div>
    </div>;
  },
});

module.exports = List;