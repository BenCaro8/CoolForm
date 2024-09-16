"use client";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useAppSelector, useAppDispatch } from "../lib/store";
import { User, setUser } from "../lib/slices/sessionSlice";
import { PayloadError } from "relay-runtime";
import Section from "../lib/components/Section";
import Title from "../lib/components/Title";
import TextInput from "../lib/components/TextInput";
import Button from "../lib/components/Button";
import {
  page_LoginMutation,
  page_LoginMutation$data,
} from "./__generated__/page_LoginMutation.graphql";
import { redirect } from "next/navigation";
import styles from "./styles/page.module.scss";

const loginMutation = graphql`
  mutation page_LoginMutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      username
      role
    }
  }
`;

const Login: FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [commitMutation, isMutationInFlight] =
    useMutation<page_LoginMutation>(loginMutation);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      user.role === "admin"
        ? redirect("/admin-dashboard")
        : redirect("/user-dashboard");
    }
  }, [user]);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  const submitLogin = () => {
    const completed = (
      res: page_LoginMutation$data,
      errors: PayloadError[] | null
    ) => {
      if (res.loginUser) {
        dispatch(setUser(res.loginUser as User));
      }
      if (errors) {
        console.log(errors);
      }
    };
    const criticalError = (err: Error) => {
      console.log(err);
    };
    commitMutation({
      variables: { username, password },
      onCompleted: completed,
      onError: criticalError,
    });
  };

  const isSubmitDisabled =
    isMutationInFlight || !username.trim() || !password.trim();

  return (
    <Section style="m-4" center>
      <div className={styles.loginWrapper}>
        <div className="flex">
          <Title fontFamily="Gugi" size="large" noMargin>
            Log
          </Title>
          <Title
            fontFamily="Gugi"
            size="large"
            color="primary-accent-color"
            noMargin
          >
            in
          </Title>
        </div>
        <div className="center flex flex-col my-4">
          <TextInput
            placeholder="Username"
            icon="user"
            value={username}
            handleOnChange={handleUsernameChange}
          />
          <TextInput
            placeholder="Password"
            icon="password"
            password
            value={password}
            handleOnChange={handlePasswordChange}
            handleEnterPress={isSubmitDisabled ? undefined : submitLogin}
          />
        </div>
        <div className="ml-auto">
          <Button handleClick={submitLogin} disabled={isSubmitDisabled} right>
            <Title size="small">Sign In</Title>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Login;
