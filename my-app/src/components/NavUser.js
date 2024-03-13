import {Outlet, Link, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./AuthProvider";
function Nav(){
  const { adminName, logout } = useContext(AuthContext);
  let navigate = useNavigate();
  const routeLogin = () => {
    navigate(`/`);
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
                    className="log log1" >{adminName}<a
                    href="/" ><span
                    className="glyphicon glyphicon-log-out" aria-hidden="true" onClick={logout}></span>&nbsp;Logout</a></span></span>
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
        <a className="nav-link" href="/">Home Page</a>
      </li>
      <li className="nav-item active">
        <Link className="nav-link" to="/quiz">Add Product</Link>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/quiz/product">Products</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/quiz/manufacture">Manufacturers</a>
      </li>
    </ul>
  </div>
</nav>

<Outlet />
</>
    )
}

export default Nav