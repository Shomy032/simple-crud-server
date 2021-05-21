import React from "react" ;
import "./styles.css"
// import  "./script.js" ;



class Form extends React.Component {
  

  
  render() {
    return (
      <div className="Form" onClick={apiCall}>
         <div className="container">
      <div className="row">
          <div className="col-lg-3 col-md-2"></div>
          <div className="col-lg-6 col-md-8 login-box">
              <div className="col-lg-12 login-key">
                  <i className="fa fa-key" aria-hidden="true" />
              </div>
              <div className="col-lg-12 login-title">
                  ADMIN PANEL
              </div>
  
              <div className="col-lg-12 login-form">
                  <div className="col-lg-12 login-form">
  
                      <form id="form">
                          <div className="form-group">
                              <label htmlFor="username" 
                              className="form-control-label"
                              >USERNAME</label>
                              <input id="username" 
                              type="text"
                               className="form-control" 
                               name="username" />
                          </div>
                          <div className="form-group">
                              <label className="form-control-label"
                              htmlFor="password"
                              >PASSWORD</label>
                              <input id="password"
                               type="password"
                               name="password"
                                className="form-control"  />
                          </div>
  
                          <div className="col-lg-12 loginbttm">
                              <div className="col-lg-6 login-btm login-text">
                                 
                              </div>
                              <div className="col-lg-6 login-btm login-button">
                                  <button id="btn" type="submit" className="btn btn-outline-primary">LOGIN</button>
                              </div>
                          </div>
                      </form>
               
                  </div>
              </div>
              <div className="col-lg-3 col-md-2"></div>
          </div>
      </div>
  
      </div>
      </div>
      
    )
   
  }
  
}

async function apiCall(event) {
  event.preventDefault()
  // let user = username.value;
  // let pass = password.value;
  try {
    fetch('http://127.0.0.1:3737/login' , {
         method: 'POST',
         headers: {
        'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           username : "my username" ,
           password : "my password"
         })
       })
      //  .then(res => res.json())
      //  .then(data => console.log(data))
  
  } catch(err) {
  console.log(err)
  }  
}




export default Form;