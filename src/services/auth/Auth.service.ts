import { setCookie, removeCookie } from "typescript-cookie";

import axios from "../../api/axios";
import { SignUpType } from "../../types/auth/Signup.type";

const dateAccessToken: Date = new Date();

const Signup = async (signupDTO: SignUpType) => {
    const signupResponse: any = await axios.post("/signup", signupDTO);

    if (signupResponse.status === 201) {
        dateAccessToken.setTime(dateAccessToken.getTime() + 60 * 60 * 1000);
        const accessToken = signupResponse.access_token;
        setCookie("secure-access", accessToken, {
          secure: true,
          expires: dateAccessToken,
          sameSite: "strict",
          domain: "localhost",
        });
    }

    return signupResponse.data;
}

const AuthService = { Signup };

export default AuthService;