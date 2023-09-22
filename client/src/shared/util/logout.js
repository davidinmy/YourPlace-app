import { redirect } from "react-router-dom";

// This file does not contain any components
export function action() {
  console.log("logout now, remove token...");
  localStorage.removeItem("token");
  //   localStorage.removeItem("expiration");
  return redirect("/");
}
