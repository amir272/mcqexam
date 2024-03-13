import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./AuthProvider";
function Register(){
    const { username } = useContext(AuthContext);
const obj = {fullName: "", userName: "", contact: "", email: "", gender: "", batch: "", password: "", rollNo:"", repassword:""};
    const [formData, setFormData] = React.useState(obj);
    const [employee, setEmployee] = React.useState([]);
    const [registered, setRegistered] = React.useState(false);
    const [noCorrect, setNoCorrect] = React.useState(false)

     let navigate = useNavigate();
    const routeLogin = () => {
        navigate(`/login`, {state: formData});
    }
    if(username !== '') routeLogin();
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
        if(formData.contact.match(/\d/g).length!==10) {
            setNoCorrect(true)
        return 
    }
        if(validateEmail(formData.email)===false){

        }else{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
             fullName: formData.fullName.trim(), userName: formData.userName.trim(), email: formData.email.trim(),
            contact: formData.contact.trim(), gender: formData.gender, password: formData.password.trim(),
            batch: formData.batch.trim(), rollNo: formData.rollNo.trim()})
    };

          await fetch('/api/adduser', requestOptions)
        .then(response => response.json())
        .then(data => {
            setEmployee(data);
            document.getElementById("modal").style.display  = 'block';
            window.setTimeout(routeLogin, 5000);})
        .then(()=>setRegistered(true))
        .then(()=>setFormData(obj));
    }
}

    function validateEmail(email) {
        var validRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(validRegex)) {
          return true;
        } else {
          return false;
        }
      }

      const loginNow =<div id="modal" className="modal" tabindex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Registration successful</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
              <p><b>{employee.fullName}</b> have successfully registered</p>
              <p>Your username is <b>{employee.userName}</b> and password is <b>{employee.password}</b></p>
          </div>
        </div>
      </div>
    </div>

    return (
<div className="bg1">
    {loginNow}
<section className="h-100 h-custom">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-8 col-xl-6">
        <div className="card rounded-3">
          <div className="card-body p-4 p-md-5">
            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Registration Info</h3>
            <Link to="/login"><button type="button" className="btn btn-secondary">
                Login if already registered</button></Link><p></p>
            {registered &&<p>Successfully registered</p>}
            <form className="px-md-2" onSubmit={handleSubmit}>

            <fieldset>
              <div className="row">
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="fullName">Full name</label>
                    <div className="col-md-12">
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange}
                               className="form-control" placeholder="Eg. John Snow" required="true"/>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="userName">Username</label>
                    <div className="col-md-12">
                        <input type="text" className="form-control" name="userName"  value={formData.userName} onChange={handleChange}
                               id="userName" placeholder="Eg. johnsnow" required="true"/>

                    </div>
                </div>

                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="rollNo">Roll no.</label>
                      <div className="col-md-12">
                          <input type="text" className="form-control" name="rollNo"  value={formData.rollNo} onChange={handleChange}
                                 id="rollNo" placeholder="Eg. I-25" required="true"/>

                      </div>
                  </div>

                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="gender"></label>
                      <div className="col-md-12">
                    <select id="gender" value={formData.gender} onChange={handleChange} name="gender"
                            className="form-control input-md" required="true">
                        <option value="1">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                      </div>
                </div>

                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="batch"></label>
                      <div className="col-md-12">
                          <select id="batch" name="batch" placeholder="Select your branch" required="true"
                                  className="form-control input-md" value={formData.batch} onChange={handleChange}>
                              <option value="Null">Select your batch</option>
                              <option value="Batch1">Batch 1</option>
                              <option value="Batch2">Batch 2</option>
                              <option value="Batch3">Batch 3</option>
                              <option value="Batch4">Batch 4</option>
                              <option value="Batch5">Batch 5</option>
                              <option value="Batch6">Batch 6</option>
                          </select>
                  </div>
              </div>


                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="email">Email</label>
                      <div className="col-md-12">
                          <input type="email" id="email" name="email" className="form-control"value={formData.email}
                                 required="true"  onChange={handleChange} placeholder="Eg. johnsnow@abc.com"/>
                      </div>
                  </div>


                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="contact">Contact No.</label>
                      <div className="col-md-12">
                          <input type="text" id="contact" name="contact" className="form-control" value={formData.contact}
                                 required="true"  onChange={handleChange} placeholder="Eg. 9856012345" minLength="10"/>
                      </div>
                  </div>

                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="password">Password</label>
                      <div className="col-md-12">
                          <input type="password" className="form-control" name="password"  value={formData.password} onChange={handleChange}
                                 required="true"  id="password" placeholder="Enter your password"/>

                      </div>
                  </div>

                  <div className="form-group">
                      <label className="col-md-12 control-label" htmlFor="repassword">Re enter Password</label>
                      <div className="col-md-12">
                          <input type="password" className="form-control" name="repassword"  value={formData.repassword} onChange={handleChange}
                                 required="true" id="repassword" placeholder="Enter your password again to verify"/>

                      </div>
                  </div>

              <div className="form-group">
                  <label className="col-md-12 control-label" htmlFor="submit"></label>
                  <div className="col-md-12">
                <button type="submit" className="btn btn-success btn-lg mb-1">Submit</button></div>
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

export default Register;
