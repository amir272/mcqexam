import React, {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import {AuthContext} from "./AuthProvider";

function AdminLogin(){
    const { adminName, admin} = useContext(AuthContext);
    let navigate = useNavigate();
    const routeAdmin = () => {
        let path = `/quiz`;
        navigate(path);
    }
    if(adminName !== '') routeAdmin();

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
        console.log(formData)
    }
    async function handleSubmit(e){
        e.preventDefault();
        if(formData.username === 'gunchu' && formData.password === 'gunchu@123'){
            admin(formData.username)
            routeAdmin();
        }
        else setMsg("Incorrect username or password")
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

export default AdminLogin;