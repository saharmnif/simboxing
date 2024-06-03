import React, { useState , useEffect } from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
import Topbar from "../src/Scenes/global/Topbar";
import Sidebaradmin from "./Scenes/global/Sidebaradmin";
import Sidebaroperationnel from "./Scenes/global/Sidebaroperationnel";
import Sidebarbusiness from "./Scenes/global/Sidebarbusiness"
import Team from "../src/Scenes/team/index";
import Addteam from "../src/Scenes/team/addteam";
import Updateteam from "./Scenes/team/updateteam";
import LoginForm from '../src/Components/LoginForm';
import Dashboardadmin from './Scenes/dashboard/dashboardadmin';
import Dashboardoperationnel from './Scenes/dashboard/dashboardoperationnel';
import Dashboardbusiness from './Scenes/dashboard/dashboardbusiness';
import { ColorModeContext, useMode } from "../src/Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";


const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

   return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route
              path="/dashboardadmin/*"
              element={
                userRole === 'Admin' ? (
                  <>
                    <Sidebaradmin isSidebar={isSidebar} />
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} />
                      <Routes>
                        <Route path="/" element={<Dashboardadmin />} />
                        <Route path="team" element={<Team />} />
                        <Route path="team/addteam" element={<Addteam />} />
                        <Route path="team/updateteam/:userId" element={<Updateteam />} />
                      </Routes>
                    </main>
                  </>
                ) : (
                  <Navigate to="/unauthorized" />
                )
              }
            />
             <Route
              path="/dashboardoperationnel"
              element={
                userRole === 'Analyste operationnel' ? (
                  <>
                    <Sidebaroperationnel isSidebar={isSidebar} />
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} />
                      <Dashboardoperationnel />
                    </main>
                  </>
                ) : (
                  <Navigate to="/unauthorized" />
                )
              }
            />
            <Route
              path="/dashboardbusiness"
              element={
                userRole === 'Analyste business' ? (
                  <>
                    <Sidebarbusiness isSidebar={isSidebar} />
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} />
                      <Dashboardbusiness />
                    </main>
                  </>
                ) : (
                  <Navigate to="/unauthorized" />
                )
              }
            />
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;