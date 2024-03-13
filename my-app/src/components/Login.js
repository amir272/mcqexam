import React, {useContext, useEffect} from 'react';
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import TinyEditor from "./TinyEditor";
import {AuthContext} from "./AuthProvider";

function Login(){
    const { username, name, password, login, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    const routeLogin = () => {
        let path = `/quiz`;
        navigate(path);
    }
    if(username != '') routeLogin();
    const location = useLocation();
    console.log(location.state)
    if(location.state != null){
        login(location.state.userName, location.state.fullName, location.state.password);
        routeLogin()
    }

    const obj = {username: "", password: ""};
    const [formData, setFormData] = React.useState(obj);
    const [employee, setEmployee] = React.useState({});
    const [msg, setMsg] = React.useState("");
    function handleChange(e){
        e.preventDefault();
        setFormData(prevData =>{
           return{
            ...prevData,
            [e.target.name]: e.target.value
           } 
        })
        console.log(formData)
    }
    async function handleSubmit(e){
        e.preventDefault();
        await fetch(`api/user/${formData.username}/${formData.password}`)
      .then(response => response.json())
      .then(data => {
        setEmployee(data);
        setMsg("Successfully logged in")
          login(data.userName, data.fullName, data.password)
        routeLogin();
        console.log(employee)})
        .catch(err => {
            // Do something for an error here
            setMsg("Incorrect username password");
          })
      
  }

    return (
        <div className="bg1">
            <section className="h-100 h-custom">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-8 col-xl-6">
        <div className="card rounded-3">
          <div className="card-body p-4 p-md-5">
            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Login Info</h3>
            <Link to="/register">
                <button type="button" className="btn btn-secondary">Register if not already registered</button></Link>
            <p className="alert-danger">{msg}</p>
            <form className="px-md-2" onSubmit={handleSubmit}>



                <fieldset>
                    <div className="row">
                        <div className="form-group">
                            <label className="col-md-12 control-label" htmlFor="userName">Username</label>
                            <div className="col-md-12">
                    <input type="text" id="userName" name="username" className="form-control"value={formData.username} onChange={handleChange} />
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