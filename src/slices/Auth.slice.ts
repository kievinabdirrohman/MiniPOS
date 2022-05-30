import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./Api.slice";
import { SignInType } from "../types/auth/Signin.type";

export const extendedApiSlice: any = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    authLogin: builder.mutation({
      query: (signinDTO: SignInType) => ({
        url: "/signin",
        method: "POST",
        body: signinDTO,
      }),
      invalidatesTags: ["Auth"],
    }),
    authRegister: builder.mutation({
      query: (signupDTO: any) => ({
        url: "/signup",
        method: "POST",
        body: signupDTO,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useAuthLoginMutation, useAuthRegisterMutation } =
  extendedApiSlice;
