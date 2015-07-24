
var React = require('react');
var ActivePlayer = require('./ActivePlayer.react.js');
var AppActionCreator = require('../actioncreators/AppActionCreators.js');



var EmptyPlayer = React.createClass({

  handlePlayerReplace: function(){
    AppActionCreator.markForReplacement(this.props.data.key);
    AppActionCreator.setMessage("hi there");
  },
  render: function() {
    return (      
      <div className="player">
        <img onClick={this.handlePlayerReplace} className="shirt" src="http://cdn.ismfg.net/static/plfpl/img/shirts/shirt_0.png"/>
      </div>
    );
  }
});
module.exports = EmptyPlayer;
