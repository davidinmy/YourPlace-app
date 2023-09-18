import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  // dummy users data
  const USERS = [
    {
      id: "u1",
      name: "Max Josh",
      image:
        "https://lh3.googleusercontent.com/ulTNkL1s8SxAEkwH4pxkHxMYh2r5HJeBRcURychonbbelmY7Yg1mFkJUS_toAPVTTBGqDtuc1dq5ZwsJv9fUQ0h12f5M919x10wmaUU",
      places: 3,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
