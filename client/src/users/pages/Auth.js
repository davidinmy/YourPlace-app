import React, { useState } from "react";
import { Form, Link, useSearchParams, json, redirect } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
// import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoginMode = searchParams.get("mode") === "login";
  // const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    // setIsLoginMode((prevMode) => !prevMode);
  };

  // **********fake token login**********
  // const token = "thisisafaketokenwhichisusedtotestifthisworks";

  // store the token in local storage
  // localStorage.setItem("token", token);
  // console.log(localStorage.getItem("token"));

  // store the expiration time
  //   const expiration = new Date();
  //   expiration.setHours(expiration.getHours() + 1);
  //   localStorage.setItem("expiration", expiration.toISOString());

  // return redirect("/");

  return (
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>Login Required</h2>
      <hr />
      <Form method="post">
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            name="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name"
            onInput={inputHandler}
          />
        )}
        <Input
          id="email"
          name="email"
          element="input"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          name="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password! (min. length 6)"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </Form>
      <Link
        to={`?mode=${isLoginMode ? "signup" : "login"}`}
        onClick={switchModeHandler}
      >
        SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
      </Link>
    </Card>
  );
};

export default Auth;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  };
  console.log("authData====" + JSON.stringify(authData));

  const response = await fetch("http://localhost:5001/api/users/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  console.log(await response.json());
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }

  // **********fake token login**********
  const token = "thisisafaketokenwhichisusedtotestifthisworks";

  // store the token in local storage
  localStorage.setItem("token", token);

  return redirect("/");
}
