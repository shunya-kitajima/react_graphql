import React, { useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useMutation } from "@apollo/client";

import styles from "./EmployeeList.module.css";
import { StateContext } from "../context/StateContext";
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from "../queries";

const EmployeeList = ({ dataEmployees }) => {
  const {
    setName,
    setJoinYear,
    setSelectedDept,
    setEditedId,
    // dataSingleEmployee,
    // getSingleEmployee,
  } = useContext(StateContext);

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  return (
    <>
      <h3>Employee List</h3>
      <ul className={styles.employeeList__list}>
        {dataEmployees &&
          dataEmployees.allEmployees &&
          dataEmployees.allEmployees.edges.map((empl) => (
            <li className={styles.employeeList__item} key={empl.node.id}>
              <span>
                {empl.node.name} {" / "}
                {empl.node.joinYear}
                {" / "}
                {empl.node.department.deptName}
              </span>
              <div>
                <DeleteIcon
                  className={styles.employeeList__delete}
                  onClick={async () => {
                    try {
                      await deleteEmployee({
                        variables: {
                          id: empl.node.id,
                        },
                      });
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                />
                <EditIcon
                  className={styles.employeeList__edit}
                  onClick={() => {
                    setEditedId(empl.node.id);
                    setName(empl.node.name);
                    setJoinYear(empl.node.joinYear);
                    setSelectedDept(empl.node.department.id);
                  }}
                />
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default EmployeeList;
