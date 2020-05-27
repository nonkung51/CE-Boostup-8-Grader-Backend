import { v4 } from "https://deno.land/std/uuid/mod.ts";

import { User } from "../types.ts";
import { insertUser, checkIfUserExisted, getUserFromDB } from "../database.ts";

// @desc    Add user
// @route   Post /api/v1/register
const addUser = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    const user: User = body.value;
    user.id = v4.generate();
    user.token = v4.generate();
    let userExist: boolean = false;

    try {
      userExist = await checkIfUserExisted(user);

      if (!userExist) {
        await insertUser(user);
      }
    } catch (error) {
      console.log(error);
    }

    if (!userExist) {
      response.status = 201;
      response.body = {
        success: true,
        data: user,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "user with that username already exists!",
      };
    }
  }
};

// @desc    sign in
// @route   Post /api/v1/login
const signIn = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const { username, password } = body.value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    const dbUser = await getUserFromDB({ username });
    if (password === dbUser[2]) {
      response.status = 200;
      response.body = {
        success: true,
        token: dbUser[4]
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "password incorrect",
      };
    }
  }
};

export { addUser, signIn };
