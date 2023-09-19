import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../AuthContext";
import "./Breadcrumb.css";

const Breadcrumb = () => {
  const { course } = useContext(AuthContext);
  const { assignment } = useContext(AuthContext);
  
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  

  // Define an array of route paths to exclude from breadcrumbs
  const excludeBreadcrumbPaths = ["/login", "/"];

  // // Check if the current route should exclude breadcrumbs
  const shouldExcludeBreadcrumbs = excludeBreadcrumbPaths.includes(
    location.pathname
  );

  if (shouldExcludeBreadcrumbs) {
    return null; // Render nothing for excluded routes
  }

  return (
    <div className="breadcrumb-container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li
                key={name}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
              >
                {index === 0 ? (
                  course.name
                 ) : 
                index === 1 ? (
                  assignment.title
                ) : 
                isLast ? (
                  course.name
                ) : (
                  <Link to={routeTo}>{name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;