import React, { useEffect, useState } from "react";
import {
  Form,
  Link,
  useSearchParams,
  json,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";

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
  const data = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoginMode = searchParams.get("mode") === "login";
  const navigation = useNavigation();
  const isLoading = navigation.state;
  const [error, setError] = useState(data?.message);

  useEffect(() => {
    if (data?.errors) {
      setError(data.message);
    }
  }, [data]);

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

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading === "submitting" && <LoadingSpinner asOverlay />}
        {isLoginMode ? <h2>Login Required</h2> : <h2>Create a new user</h2>}
        <hr />
        <Form method="post">
          {data && data.errors && (
            <ul>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          {data && data.message && <p>{data.message}</p>}
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
    </React.Fragment>
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
  // console.log(await response.json());
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }

  // **********fake token login**********
  const token = "thisisafaketokenwhichisusedtotestifthisworks";

  // store the token in local storage
  localStorage.setItem("token", token);

  return redirect("/");
}
