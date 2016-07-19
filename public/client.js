$.getJSON('/api/user', function(data){
  console.log(data)
})

var Example = React.createClass({
  render: function() {

    return (
      <div className="commentList">
        hello world
        <Button size="large">click me</Button>
        <Button>regular</Button>
        <Button size="small">or me</Button>
      </div>
    );
  }
});

var Button = React.createClass({
  render: function() {
    var className = "button"
    if (this.props.size === "large") {
      className += " button-large"
    }
    if (this.props.size === "small") {
      className += " button-small"
    }
    return (
      <button className={className}>{this.props.children}</button>
    );
  }
});

ReactDOM.render(
  <Example />,
  document.getElementById('content')
);