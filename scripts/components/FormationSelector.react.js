
var React = require('react');
var Common = require('./common.js');

var FormationSelector = React.createClass({
  componentDidMount: function() {
    React.findDOMNode(this.refs.formation).value = Common.PitchActions.getFormation();
  },
  handleFormationChange: function(e) {
    e.preventDefault();
    Common.PitchActions.setFormation(e.target.value);
  },
  render: function() {
    return (
      <div className="formationSelector">
        <select ref="formation" onChange={this.handleFormationChange}>
          <option value="4-4-2">4-4-2</option>
          <option value="4-1-3-1">4-1-3-1</option>
        </select>
      </div>
    );
  }
});
module.exports = FormationSelector;
