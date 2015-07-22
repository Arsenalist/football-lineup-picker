
var React = require('react');

var Message = React.createClass({
  getInitialState: function() {
    return (
      {message: this.props.message}
    );
  },
  render: function() {
      if (this.state.message) {
        return <div className="alert alert-info">{this.state.message}</div>
      }  else {
        return <span/>;
      }
  }
});
module.exports = Message;
