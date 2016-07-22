// var Example = React.createClass({
//   render: function() {

//     return (
//       <div className="commentList">
//         hello world
//         <Button size="large">click me</Button>
//         <Button>regular</Button>
//         <Button size="small">or me</Button>

//         <ImageThing location='http://thecatapi.com/api/images/get?format=src&type=gif' alt='This is my image thing' />
//         <ImageThing location='https://www.petfinder.com/wp-content/uploads/2012/11/140272627-grooming-needs-senior-cat-632x475.jpg' alt='image 2' />
//       </div>
//     );
//   }
// });

// var Button = React.createClass({
//   render: function() {
//     var className = "button"
//     if (this.props.size === "large") {
//       className += " button-large"
//     }
//     if (this.props.size === "small") {
//       className += " button-small"
//     }
//     return (
//       <button className={className}>{this.props.children}</button>
//     );
//   }
// });

// var ImageThing = React.createClass({
//   doThing: function() {
//     alert( this.props.alt );
//   },

//   render: function() {
//     return (
//       <img src={this.props.location} alt={this.props.alt} onClick={this.doThing}/>
//     );
//   }
// })

// Root helps you login
var Root = React.createClass({
  propTypes: {
    path: React.PropTypes.string.isRequired,
  },

  getInitialState: function(){
    return {
      profile: null
    }
  },

  componentWillMount: function(){
    // this === instance of our Root react component
    // var self = this
    // $.getJSON('/api/profile', function(profile){
    //   self.setState({profile: profile})
    // })
    $.getJSON('/api/profile', function(profile){
      this.setState({profile: profile})
    }.bind(this))
  },

  render: function(){
    var profile = this.state.profile;
    // console.log('RENDER', profile)
    if (profile === null){
      return <div>Loading...</div>;
    }

    if (profile.notLoggedIn){
      return <LoginPage loginURI={profile.authorizationURI} />
      // return LoginPage({loginURI: profile.authorizationURI})
    }

    if (profile.error){
      return (
        <div>Login error {profile.error}</div>
      )
    }
    
    return <Router path={this.props.path} profile={profile} />
  }
})

// var LoginPage = function(props){
//   return <div>
//     <a href={props.loginURI}>click here to login</a>
//   </div>
// }

var LoginPage = React.createClass({
  propTypes: {
    loginURI: React.PropTypes.string.isRequired,
  },
  render: function(){
    return <div>
      <a href={this.props.loginURI}>click here to login</a>
    </div>
  }
})


var Router = React.createClass({
  propTypes: {
    path: React.PropTypes.string.isRequired,
    profile: React.PropTypes.object.isRequired,
  },
  render: function(){
    // console.log('RENDER router', this.props)
    var profile = this.props.profile;
    var path = this.props.path;
    var Page = router(path)
    return <Page profile={profile} />
  }
})



//kicks off functionality of the page
ReactDOM.render(
  <Root path={location.pathname} />,
  document.getElementById('content')
);


function router(path){
  switch (path) {
    case '/':
      return HomePage
    case '/goals':
      return GoalsPage
    default: 
      return NotFoundPage
  }
}

var HomePage = React.createClass({
  propTypes: {
    profile: React.PropTypes.object.isRequired,
  },
  render: function(){
    var profile = this.props.profile;
    return  (
      <div>
        <h1>Welcome back {profile.name}</h1>
        <a href="/goals">Goals</a>
        <img src={profile.avatar_url} />
      </div>
    )
  }
})

function NotFoundPage(props){
  return <h1>Page Not Found</h1>
}


var GoalsPage = React.createClass({
  propTypes: {
    profile: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      goals: null
    }
  },

  componentWillMount: function(){
    $.getJSON('/api/goals', function(goals){
      this.setState({goals: goals})
    }.bind(this))
  },

  render: function(props){
    return <div>
      <h1>Goals Page</h1>
      <GoalsTable goals={this.state.goals}/>
    </div>;
  }
});

var GoalListItem = function(props){
  return <li key={props.id}>
    <a href={"/goals/"+props.number}>{props.title}</a>
  </li>
}

var GoalsTable = React.createClass({
  render: function() {
    var rows = [];
    var goals = this.props.goals 
    
    if (goals === null) return <div>Loading...</div>
    var rows = goals.map(function(goal){
      return <GoalsTableRow key={goal.id} {...goal} />
    });

    return <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  }
})

// var GoalsTableRow = React.createClass({
//   render: function() {
//     return <tr>
//       <td>{this.props.title}</td>
//       <td>{this.props.user.login}</td>
//     </tr>
//   }
// })

var GoalsTableRow = function(props) {
  var labels = props.labels.map(function(label){
    return <div key={label.name} style={{backgroundColor: '#'+label.color}}>{label.name}</div>
  })
  return <tr>
    <td>{props.title}</td>
    <td>{props.user.login}</td>
    <td>{labels}</td>
  </tr>
}








