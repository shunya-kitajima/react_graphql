import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Grid } from "@material-ui/core";
import jwtDecode from "jwt-decode";

import styles from "./MainPage.module.css";
import { GET_EMPLOYEES, GET_DEPTS } from "../Queries";
import EmployeeList from "./EmployeeList";

const Mainpage = () => {
  const {
    loading: loadingEmpoyees,
    data: dataEmployees,
    error: errorEmployees,
  } = useQuery(GET_EMPLOYEES);

  const {
    loading: loadingDepts,
    data: dataDepts,
    error: errorDepts,
  } = useQuery(GET_DEPTS);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
      }
    } else {
      window.location.href("/");
    }
  }, [errorEmployees, errorDepts]);

  if (loadingEmpoyees || loadingDepts) {
    return <h1>Loading from server</h1>;
  } else if (errorEmployees || errorDepts) {
    return (
      <>
        <h1>Employees data fetch error : {errorEmployees.message}</h1>
        <h1>Departments data fetch error : {errorDepts.message}</h1>
      </>
    );
  }

  return (
    <div className={styles.mainPage}>
      <h1>
        GraphQL lesson
        <ExitToAppIcon
          className={styles.mainPage__out}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />
      </h1>
      <Grid container>
        <Grid item xs={5}>
          <EmployeeList dataEmployees={dataEmployees} />
        </Grid>
        <Grid item xs={4}>
          {" "}
        </Grid>
        <Grid item xs={3}>
          {" "}
        </Grid>
      </Grid>
    </div>
  );
};

export default Mainpage;
