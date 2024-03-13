import {Outlet, Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./AuthProvider";
function Nav(){
  const { adminName, logout } = useContext(AuthContext);
  let navigate = useNavigate();
  const routeLogin = () => {
    navigate(`/admin`);
  }
  if(adminName === '') routeLogin();
    return (
        <>
            <div className="header">
              <div className="row">
                <div className="col-lg-6">
                  <span className="logo">Gunchu</span></div>
                <div className="col-lg-3"></div>
                <div className="col-lg-3">
                <span className="pull-right top title1 navbar-brand"><span style={{color:"white" ,marginTop:"20px"}}><span
                    className="glyphicon glyphicon-user" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;&nbsp;Hello,</span> <span
                    className="log log1" >{adminName}<Link
                    to="/" ><span
                    className="glyphicon glyphicon-log-out" aria-hidden="true" onClick={logout}></span>&nbsp;Logout</Link></span></span>
              </div>
              </div>
            </div>
        <nav style={{position: "inherit"}} className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
    <li className="nav-item active">
      <Link className="nav-link" to="/manage">Available Exams</Link>
      </li>
      <li className="nav-item active">
        <Link className="nav-link" to="/manage/add-exam">Add Exam</Link>
      </li>
      <li className="nav-item active">
        <Link className="nav-link" to="/manage/all-history">Exam Reports</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/manage/users">Students</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/manage/remove-exam">Remove Exam</Link>
      </li>
    </ul>
  </div>
</nav>

<Outlet />
</>
    )
}

export default Nav