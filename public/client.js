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
        <element></element>
        <ImageThing location='http://thecatapi.com/api/images/get?format=src&type=gif' alt='This is my image thing' />
        <ImageThing location='https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg' alt='image 2' />
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

var ImageThing = React.createClass({
  doThing: function() {
    alert( this.props.alt );
  },

  render: function() {
    return (
      <img src={this.props.location} alt={this.props.alt} onClick={this.doThing}/>
    );
  }
})

ReactDOM.render(
  <Example />,
  document.getElementById('content')
);