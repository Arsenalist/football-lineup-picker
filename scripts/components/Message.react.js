
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');

var Message = React.createClass({
  getInitialState: function() {
    return (
      {message: null}
    );
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      message: AppStore.getMessage()
    });
  },

  render: function() {
      if (this.state.message != null) {
        return <div className="alert alert-info">{this.state.message}</div>
      }  else {
        return <span/>;
      }
  }
});
module.exports = Message;
