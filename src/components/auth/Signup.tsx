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
import LoadingButton from "@mui/lab/LoadingButton";

import { SignUpType } from "../../types/auth/Signup.type";
import { useAuthRegisterMutation } from "../../slices/Auth.slice";
import signup from "../../images/signup.jpg";

const expiryAccessToken: Date = new Date();

const SignUpSchema: yup.SchemaOf<SignUpType> = yup
  .object({
    full_name: yup.string().trim().required("Full Name is required").defined(),
    email: yup
      .string()
      .lowercase()
      .email("Enter a valid email. ex: me@mail.com")
      .required("Email is required")
      .defined(),
    password: yup
      .string()
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}.*$/,
        {
          message:
            "Password must be contains at least 8 characters, both lower (a-z) and upper case letters (A-Z), at least one number (0-9) and a symbol",
          excludeEmptyString: false,
        }
      )
      .trim()
      .required("Password is required")
      .defined(),
    password_confirmation: yup
      .string()
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}.*$/,
        {
          message:
            "Password must be contains at least 8 characters, both lower (a-z) and upper case letters (A-Z), at least one number (0-9) and a symbol",
          excludeEmptyString: false,
        }
      )
      .trim()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password Confirmation is required")
      .defined(),
    phone_number: yup
      .string()
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
        message:
          "Enter a Valid Phone Number. ex: +123456890 (with Country Code)",
        excludeEmptyString: false,
      })
      .required("Phone Number is required")
      .defined(),
  })
  .defined();

const SignUp: React.FC<{}> = () => {
  const [authRegister, { isLoading }] = useAuthRegisterMutation();
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
  const registerForm = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const signUpResponse = await authRegister({
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
      });
      if (signUpResponse.error) {
        setShowAlert(true);
        setErrorMessage(signUpResponse.error.data);
      } else {
        expiryAccessToken.setTime(expiryAccessToken.getTime() + 60 * 60 * 1000);
        setCookie("secure-access", signUpResponse.data.accessToken, {
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
              Let's Grow with Us!
            </Typography>
            <form onSubmit={registerForm.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  type="text"
                  id="full_name"
                  name="full_name"
                  label="Full Name"
                  value={registerForm.values.full_name}
                  onChange={registerForm.handleChange}
                  error={
                    registerForm.touched.full_name &&
                    Boolean(registerForm.errors.full_name)
                  }
                  helperText={
                    registerForm.touched.full_name &&
                    registerForm.errors.full_name
                  }
                  variant="standard"
                  autoFocus
                />
                <TextField
                  autoComplete="off"
                  fullWidth
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  label="Phone Number"
                  value={registerForm.values.phone_number}
                  onChange={registerForm.handleChange}
                  error={
                    registerForm.touched.phone_number &&
                    Boolean(registerForm.errors.phone_number)
                  }
                  helperText={
                    registerForm.touched.phone_number &&
                    registerForm.errors.phone_number
                  }
                  placeholder="+123456789"
                  variant="standard"
                />
                <TextField
                  autoComplete="off"
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  value={registerForm.values.email}
                  onChange={registerForm.handleChange}
                  error={
                    registerForm.touched.email &&
                    Boolean(registerForm.errors.email)
                  }
                  helperText={
                    registerForm.touched.email && registerForm.errors.email
                  }
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
                  value={registerForm.values.password}
                  onChange={registerForm.handleChange}
                  error={
                    registerForm.touched.password &&
                    Boolean(registerForm.errors.password)
                  }
                  helperText={
                    registerForm.touched.password &&
                    registerForm.errors.password
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
                <TextField
                  variant="standard"
                  autoComplete="off"
                  fullWidth
                  id="password_confirmation"
                  name="password_confirmation"
                  label="Password Confirmation"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={registerForm.values.password_confirmation}
                  onChange={registerForm.handleChange}
                  error={
                    registerForm.touched.password_confirmation &&
                    Boolean(registerForm.errors.password_confirmation)
                  }
                  helperText={
                    registerForm.touched.password_confirmation &&
                    registerForm.errors.password_confirmation
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword("password-confirm")}
                        >
                          {showPasswordConfirm ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <p className="text-center text-sm">
                  By clicking Join Now, I agree that I have read and accepted
                  the Terms of Use and Privacy Policy.
                </p>
                {!isLoading && (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="drop-shadow-2xl rounded-2xl bg-black py-3 mt-6 text-base font-semibold capitalize"
                  >
                    Join Now
                  </Button>
                )}
                {isLoading && (
                  <LoadingButton
                    loading
                    loadingIndicator="Creating Account..."
                    variant="outlined"
                  >
                    Creating Account
                  </LoadingButton>
                )}
              </Stack>
            </form>
            <Divider className="my-10" />
            <p className="text-center text-base">Already have an account?</p>
            <p className="text-center">
              <a href="/" className="text-base font-medium text-blue-600">
                Sign In
              </a>
            </p>
          </Grid>
          <Grid item lg={6} className="hidden xl:block mt-20">
            <img src={signup} alt="Logo" />;
          </Grid>
        </Grid>
      </Suspense>
    </>
  );
};

export default SignUp;
