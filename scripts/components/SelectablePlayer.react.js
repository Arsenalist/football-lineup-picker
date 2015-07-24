var React = require('react');
var AppActionCreators = require('../actioncreators/AppActionCreators.js');


var SelectablePlayer = React.createClass({
  handlePlayerSelection: function(e){
    e.preventDefault();
    AppActionCreators.addPlayer(this.props.data);
  },
  render: function() {
    return(
      <tr>
        <td><a href="#" onClick={this.handlePlayerSelection}>{this.props.data.name}</a></td>
        <td>{this.props.data.position}</td>
      </tr>
    );
  }
});
module.exports = SelectablePlayer;
