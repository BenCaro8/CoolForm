"use client";
import { ChangeEvent, FC, SetStateAction, useEffect, useState } from "react";
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
import {
  page_CreateUserMutation,
  page_CreateUserMutation$data,
} from "./__generated__/page_CreateUserMutation.graphql";
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

const createUserMutation = graphql`
  mutation page_CreateUserMutation($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
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
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [commitSignInMutation, isSignInMutationInFlight] =
    useMutation<page_LoginMutation>(loginMutation);
  const [commitCreateUserMutation, isCreateUserMutationInFlight] =
    useMutation<page_CreateUserMutation>(createUserMutation);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      user.role === "admin"
        ? redirect("/admin-dashboard")
        : redirect("/user-dashboard");
    }
  }, [user]);

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement>,
    setState: (value: SetStateAction<string>) => void
  ) => {
    const value = event.target.value;
    setState(value);
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
    commitSignInMutation({
      variables: { username, password },
      onCompleted: completed,
      onError: criticalError,
    });
  };

  const createUser = () => {
    const completed = (
      res: page_CreateUserMutation$data,
      errors: PayloadError[] | null
    ) => {
      if (res.createUser) {
        dispatch(setUser(res.createUser as User));
      }
      if (errors) {
        console.log(errors);
      }
    };
    const criticalError = (err: Error) => {
      console.log(err);
    };
    commitCreateUserMutation({
      variables: { username: registerUsername, password: registerPassword },
      onCompleted: completed,
      onError: criticalError,
    });
  };

  const isSubmitDisabled =
    isSignInMutationInFlight || !username.trim() || !password.trim();

  const isSignUpDisabled =
    isCreateUserMutationInFlight ||
    !registerUsername.trim() ||
    !registerPassword.trim() ||
    !confirmPassword.trim() ||
    confirmPassword !== registerPassword;

  if (isRegistering) {
    return (
      <Section style="m-4" center flexCol>
        <Title fontFamily="Gugi" size="large" noMargin>
          Register:
        </Title>
        <div className="center flex flex-col my-4">
          <TextInput
            placeholder="Username"
            icon="user"
            value={registerUsername}
            handleOnChange={(event) =>
              handleTextChange(event, setRegisterUsername)
            }
          />
          <TextInput
            placeholder="Password"
            icon="password"
            password
            value={registerPassword}
            handleOnChange={(event) =>
              handleTextChange(event, setRegisterPassword)
            }
          />
          <TextInput
            placeholder="Confirm Password"
            icon="password"
            password
            value={confirmPassword}
            handleOnChange={(event) =>
              handleTextChange(event, setConfirmPassword)
            }
            handleEnterPress={isSignUpDisabled ? undefined : createUser}
          />
        </div>
        <div className="ml-auto flex flex-col">
          <Button handleClick={createUser} disabled={isSignUpDisabled}>
            <Title size="small">Sign Up</Title>
          </Button>
        </div>
      </Section>
    );
  }

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
            handleOnChange={(event) => handleTextChange(event, setUsername)}
          />
          <TextInput
            placeholder="Password"
            icon="password"
            password
            value={password}
            handleOnChange={(event) => handleTextChange(event, setPassword)}
            handleEnterPress={isSubmitDisabled ? undefined : submitLogin}
          />
        </div>
        <div className="ml-auto flex flex-col">
          <Button handleClick={submitLogin} disabled={isSubmitDisabled} right>
            <Title size="small">Sign In</Title>
          </Button>
          <div className="mt-4">
            <Button handleClick={() => setIsRegistering(true)} right>
              <Title size="small">Register</Title>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Login;
