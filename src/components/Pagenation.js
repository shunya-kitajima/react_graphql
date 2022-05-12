import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useLazyQuery } from "@apollo/react-hooks";
import SearchIcon from "@material-ui/icons/Search";
import { Grid } from "@material-ui/core";

import styles from "./Pagenation.module.css";
import {
  PAGENATE_FIRST_EMPLOYEE,
  PAGENATE_LAST_EMPLOYEE,
  PAGENATE_MORE_EMPLOYEE,
} from "../queries";
import { Search } from "@material-ui/icons";

const NUM_PAGE = 3;
const Pagenation = () => {
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(0);
  const [pagenateFirst, { data: dataFirst, error: errorFirst }] = useLazyQuery(
    PAGENATE_FIRST_EMPLOYEE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [pagenateLast, { data: dataLast, error: errorLast }] = useLazyQuery(
    PAGENATE_LAST_EMPLOYEE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const {
    data: dataPages,
    error: errorPages,
    loading: loadingPages,
    fetchMore,
  } = useQuery(PAGENATE_MORE_EMPLOYEE, {
    variables: { first: NUM_PAGE, after: null },
    fetchPolicy: "cache-and-network",
  });

  if (loadingPages) return <h1>Loading from server...</h1>;

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <h3>Pagenate by first</h3>
          <input
            type="number"
            min="0"
            value={first}
            onChange={(e) => {
              setFirst(e.target.value);
            }}
          />
          <div>
            <SearchIcon
              className={styles.pagenation__search}
              onClick={async () => {
                await pagenateFirst({
                  variables: {
                    first: first,
                  },
                });
                setFirst(0);
              }}
            />
          </div>
          <ul className={styles.pagenation__list}>
            {errorFirst && <h3>{errorFirst.message}</h3>}
            {dataFirst &&
              dataFirst.allEmployees &&
              dataFirst.allEmployees.edges.map((empl) => (
                <li className={styles.pagenation__item} key={empl.node.id}>
                  {empl.node.name}
                  {" / "}
                  {empl.node.joinYear}
                  {" / "}
                  {empl.node.department.deptName}
                </li>
              ))}
          </ul>
        </Grid>
        <Grid item xs={4}>
          <h3>Pagenate by last</h3>
          <input
            type="number"
            min="0"
            value={last}
            onChange={(e) => {
              setLast(e.target.value);
            }}
          />
          <div>
            <Search
              className={styles.pagenation__search}
              onClick={async () => {
                await pagenateLast({
                  variables: {
                    last: last,
                  },
                });
                setLast(0);
              }}
            />
          </div>
          <ul className={styles.pagenation__list}>
            {errorLast && <h3>{errorLast.message}</h3>}
            {dataLast &&
              dataLast.allEmployees &&
              dataLast.allEmployees.edges.map((empl) => (
                <li className={styles.pagenation__item} key={empl.node.id}>
                  {empl.node.name}
                  {" / "}
                  {empl.node.joinYear}
                  {" / "}
                  {empl.node.department.deptName}
                </li>
              ))}
          </ul>
        </Grid>
        <Grid item xs={4}>
          <h3>Pagenation load more</h3>
          <ul>
            {errorPages && <h3>{errorPages.message}</h3>}
            {dataPages &&
              dataPages.allDepartments &&
              dataPages.allDepartments.edges.map((dept) => (
                <li className={styles.pagenation__item} key={dept.node.id}>
                  {dept.node.deptName}
                </li>
              ))}
          </ul>
          {dataPages.allDepartments.pageInfo.hasNextPage && (
            <button
              onClick={() => {
                fetchMore({
                  variables: {
                    first: NUM_PAGE,
                    after: dataPages.allDepartments.pageInfo.endCursor || null,
                  },
                  updateQuery: (prevLoad, { fetchMoreResult }) => {
                    fetchMoreResult.allDepartments.edges = [
                      ...prevLoad.allDepartments.edges,
                      ...fetchMoreResult.allDepartments.edges,
                    ];
                    return fetchMoreResult;
                  },
                });
              }}
            >
              Load more
            </button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Pagenation;
