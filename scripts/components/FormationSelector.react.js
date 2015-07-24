
var React = require('react');
var AppStore = require('../stores/AppStore.js');
var AppActionCreators = require('../actioncreators/AppActionCreators.js');

var FormationSelector = React.createClass({

  getInitialState: function() {
    return {
      formation: null
    };
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    React.findDOMNode(this.refs.formation).value = this.state.formation;
    AppActionCreators.setFormation(this.state.formation);
  },

  _onChange: function() {
      this.setState({
        formation: AppStore.getFormation()
      });
  },

  handleFormationChange: function(e) {
    e.preventDefault();
    AppActionCreators.setFormation(e.target.value);
  },

  render: function() {
    return (
      <div className="formationSelector">
        <select ref="formation" onChange={this.handleFormationChange}>
          <option value="">Change Formation</option>
          <option value="3-4-3">3-4-3</option>
          <option value="4-4-2">4-4-2</option>
          <option value="4-1-3-1">4-1-3-1</option>
          <option value="5-3-2">5-3-2</option>
          
        </select>
      </div>
    );
  }
});
module.exports = FormationSelector;
