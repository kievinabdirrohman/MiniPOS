import React from "react";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OTP: React.FC<{ openState: boolean, closeState: any }> = ({ openState, closeState }) => {
  const inputOTPElement: any = [];
  const navigate = useNavigate();
  const onlyNumberInput = (event: any) => {
    if (
      !/[0-9]/.test(event.key) &&
      event.key.toLowerCase() !== "delete" &&
      event.key.toLowerCase() !== "backspace"
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  };
  const inputfocus = (event: any) => {
    const isNumericInput = onlyNumberInput(event);
    if (!isNumericInput) {
      return;
    }
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    if (
      event.key.toLowerCase() === "delete" ||
      event.key.toLowerCase() === "backspace"
    ) {
      if (index > 0) {
        form.elements[index - 2].select();
        event.preventDefault();
      }
    } else {
      if (index < 10) {
        form.elements[index + 2].select();
        event.preventDefault();
      } else {
        navigate("/home");
      }
    }
  };
  for (let index = 0; index < 6; index++) {
    inputOTPElement.push(
      <FormControl sx={{ width: "13.8%", mr: 1 }} key={index}>
        <OutlinedInput
          type="text"
          onKeyPress={(event) => onlyNumberInput(event)}
          onKeyUp={(e) => inputfocus(e)}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: "1",
          }}
          className="font-center"
        />
      </FormControl>
    );
  }

  return (
    <>
      <Dialog
        fullScreen
        open={openState}
        onClose={closeState}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Please Enter Verification Code
            </Typography>
            <Button color="inherit" className="capitalize" onClick={closeState}>
              Change Account
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <form>{inputOTPElement}</form>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OTP;
