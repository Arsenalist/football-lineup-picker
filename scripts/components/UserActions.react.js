var Message = require('./Message.react.js');
var Common = require('./common.js');

var React = require('react');
var UserActions = React.createClass({
  handleSave: function(e) {
    e.preventDefault();
    Common.PitchActions.savePitch();
  },
  render: function() {
    return (
      <div className="userActions">
        <input onClick={this.handleSave} type="button" className="btn btn-success" value="Save"/>
        <Message />
      </div>
    );
  }
});
module.exports = UserActions;
