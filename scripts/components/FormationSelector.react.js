
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
    var formations = ['3-4-3', '3-2-4-1', '4-4-2', '4-3-3', '4-2-3-1', '5-3-2', '5-4-1'];
    var formationOptions = [];
    for (var i=0; i<formations.length; i++) {
      formationOptions.push(<option value={formations[i]}>{formations[i]}</option>);
    }

    return (
      <div className="formationSelector">
        <select value="" ref="formation" onChange={this.handleFormationChange}>
          <option value="">Change Formation</option>
          {formationOptions}          
        </select>
      </div>
    );
  }
});
module.exports = FormationSelector;
