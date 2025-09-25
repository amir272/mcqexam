import React from 'react';
import NavAdmin from "./components/NavAdmin";
import Login from "./components/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./components/Register";
import Users from "./components/Users";
import PageNotFound from "./components/PageNotFound";
import AdminLogin from "./components/AdminLogin";
import ExamPage from "./components/ExamPage";
import ExamList from "./components/ExamList";
import NavUser from "./components/NavUser";
import AdminExams from "./components/AdminExams";
import ExamRemoval from "./components/ExamRemoval";
import MyHistory from "./components/MyHistory";
import AllHistory from "./components/AllHistory";
import AddSections from "./components/AddSections";
import QuizManagementPage from "./components/QuizManagementPage";

function App() {
  return (
      <   BrowserRouter>
          <Routes>
              <Route path="/" element={<Login/>}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/admin" element={<AdminLogin/>}></Route>
              <Route path="/user"  element={<NavUser />}>
                  <Route index element={<ExamList/>}/>
                  <Route path="exam" element={<ExamPage/>}></Route>
                  <Route path="my-history" element={<MyHistory/>}></Route>
              </Route>
              <Route path="/manage"  element={<NavAdmin />}>
                  <Route index element={<AdminExams/>}/>
                  <Route path="" element={<AdminExams/>} />
                  <Route path="users" element={<Users />} />
                  <Route path="add-exam" element={<QuizManagementPage />} />
                  <Route path="remove-exam" element={<ExamRemoval />} />
                  <Route path="all-history" element={<AllHistory />} />
                  <Route path="add-sections" element={<AddSections />} />
                  <Route path="**" element={<PageNotFound />} />
              </Route>
              <Route path="*" element={<PageNotFound />}></Route>

          </Routes>
      </BrowserRouter>
  );
}

export default App;
