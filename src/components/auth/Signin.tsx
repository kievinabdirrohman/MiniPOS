import * as yup from "yup";
import { useState, Suspense } from "react";
import { useFormik } from "formik";
import { setCookie } from "typescript-cookie";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";

import { SignInType } from "../../types/auth/Signin.type";
import { useAuthLoginMutation } from "../../slices/Auth.slice";
import signin from "../../images/signin.jpg";

const expiryAccessToken: Date = new Date();

const SignInSchema: yup.SchemaOf<SignInType> = yup
  .object({
    email: yup
      .string()
      .lowercase()
      .email("Enter a valid email. ex: me@mail.com")
      .required("Email is required")
      .defined(),
    password: yup.string().trim().required("Password is required").defined(),
  })
  .defined();

const SignIn: React.FC<{}> = () => {
  const [authLogin, { isLoading }] = useAuthLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleClickShowPassword = (passwordForm: string) => (event: any) => {
    if (passwordForm === "password") {
      setShowPassword(!showPassword);
      return;
    }
    setShowPasswordConfirm(!showPasswordConfirm);
  };
  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SignInSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const signInResponse = await authLogin({
        email: values.email,
        password: values.password,
      });
      if (signInResponse.error) {
        setShowAlert(true);
        setErrorMessage(signInResponse.error.data);
      } else {
        expiryAccessToken.setTime(expiryAccessToken.getTime() + 60 * 60 * 1000);
        setCookie("secure-access", signInResponse.data.accessToken, {
          secure: true,
          expires: expiryAccessToken,
          sameSite: "strict",
          domain: "localhost",
        });
        setShowAlert(false);
        setSubmitting(false);
        resetForm();
      }
    },
  });
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Grid container spacing={0}>
          <Grid item lg={6} xs={12} className="xl:px-60 lg:px-20 p-10">
            {showAlert && (
              <Collapse in={showAlert}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setShowAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  <AlertTitle>Error</AlertTitle>
                  {errorMessage}
                </Alert>
              </Collapse>
            )}
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 5, textAlign: "center" }}
              className="text-3xl font-bold"
            >
              Sign In
            </Typography>
            <form onSubmit={loginForm.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  autoComplete="off"
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  value={loginForm.values.email}
                  onChange={loginForm.handleChange}
                  error={
                    loginForm.touched.email && Boolean(loginForm.errors.email)
                  }
                  helperText={loginForm.touched.email && loginForm.errors.email}
                  variant="standard"
                />
                <TextField
                  variant="standard"
                  autoComplete="off"
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  error={
                    loginForm.touched.password &&
                    Boolean(loginForm.errors.password)
                  }
                  helperText={
                    loginForm.touched.password && loginForm.errors.password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword("password")}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember me"
                  />
                </FormGroup>
                {!isLoading && (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="drop-shadow-2xl rounded-2xl bg-black py-3 mt-6 text-base font-semibold capitalize"
                  >
                    Sign In
                  </Button>
                )}
                {isLoading && (
                  <LoadingButton
                    loading
                    loadingIndicator="Checking Account..."
                    variant="outlined"
                  >
                    Checking Account
                  </LoadingButton>
                )}
              </Stack>
            </form>
            <Divider className="my-10" />
            <p className="text-center text-base">Don't have an account?</p>
            <p className="text-center">
              <a href="/signup" className="text-base font-medium text-blue-600">
                Sign Up
              </a>
            </p>
          </Grid>
          <Grid item lg={6} className="hidden xl:block mt-20">
            <img src={signin} alt="Logo" />;
          </Grid>
        </Grid>
      </Suspense>
    </>
  );
};

export default SignIn;
