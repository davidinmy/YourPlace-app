import React from "react";
import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

import "./NavLinks.css";
import Button from "../FormElements/Button";

export const NavLinks = (props) => {
  const token = useRouteLoaderData("root");

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">ALL USERS</NavLink>
      </li>
      {token && (
        <li>
          <NavLink to="/u1/places">MY PLACES</NavLink>
        </li>
      )}
      {token && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
      )}
      {!token && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {token && (
        <li>
          <Form action="/logout" method="post">
            <Button danger>LOGOUT</Button>
          </Form>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
