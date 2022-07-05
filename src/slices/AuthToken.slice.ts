import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { AuthState } from "../types/auth/Auth.type";

const getTokenCookie = (name: string) => {
  let cookies: string[] = document.cookie.split(";");

  for (let cookieIndex = 0; cookieIndex < cookies.length; cookieIndex++) {
    let cookiePair = cookies[cookieIndex].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
};

let dataToken = getTokenCookie("secure-access");

const initialAuthState = { token: dataToken } as AuthState;

export const credentialSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setCredentials: (
      state: any,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.token = token;
    },
  },
});

export const { setCredentials } = credentialSlice.actions;
export const getActiveUser = (state: RootState) => state.auth.token;

export default credentialSlice.reducer;
