import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {AuthContext} from "./AuthProvider";

function Login(){
    const { username, login } = useContext(AuthContext);
    let navigate = useNavigate();
    const routeLogin = () => {
        let path = `/user`;
        navigate(path);
    }
    if(username !== '') routeLogin();
    const location = useLocation();
    if(location.state != null){
        login(location.state.userName, location.state.fullName, location.state.password);
        routeLogin()
    }

    const obj = {username: "", password: ""};
    const [formData, setFormData] = React.useState(obj);
    const [msg, setMsg] = React.useState("");
    function handleChange(e){
        e.preventDefault();
        setFormData(prevData =>{
           return{
            ...prevData,
            [e.target.name]: e.target.value
           } 
        })
    }
    async function handleSubmit(e){
        e.preventDefault();
        await fetch(`api/user/${formData.username}/${formData.password}`)
      .then(response => response.json())
      .then(data => {
        setMsg("Successfully logged in")
          login(data.userName, data.fullName, data.password)
        window.setTimeout(()=> routeLogin(), 1000);
        })
        .catch(err => {
            setMsg(": Incorrect username password");
          })
      
  }

    return (
        <div className="bg1">
            <section className="h-100 h-custom">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-8 col-xl-8">
        <div className="card rounded-3">
          <div className="card-body p-4 p-md-5">
            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Login Info</h3>
              <div style={{display: "inline-block", justifyContent: "center", alignItems: "center"}}>
            <Link to="/register">
                <button type="button" className="btn btn-warning btn-sm" style={{float: "left", paddingLeft: "20px"}}>Register if not registered</button></Link>
              <Link to="/admin">
                  <button type="button" className="btn btn-info btn-sm" style={{float: "left", marginLeft: "20px"}}>Click here to go to admin page</button></Link>
              </div>
            <p className="alert-danger">{msg}</p>
            <form className="px-md-2" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="row">
                        <div className="form-group">
                            <label className="col-md-12 control-label" htmlFor="userName">Username</label>
                            <div className="col-md-12">
                    <input type="text" id="userName" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                            </div>
                        </div>
                    <div className="form-group">
                        <div className="col-md-12">
                            <label htmlFor="exampleDatepicker1" className="form-label" >Password</label>
                    <input type="password" className="form-control" name="password"  value={formData.password} onChange={handleChange} id="exampleDatepicker1" />

                        </div>
                    </div>

                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="submit"></label>
                    <div className="col-md-12">
                        <button type="submit" className="btn btn-success btn-lg mb-1">Submit</button>
                    </div>
                </div>
                    </div>
                </fieldset>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
            
        </div>
    )
}

export default Login;