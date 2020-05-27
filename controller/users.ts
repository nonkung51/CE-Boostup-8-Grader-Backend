import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { save } from "https://deno.land/x/sqlite/mod.ts";

import { User } from "../types.ts";
import db from "../database.ts";

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
      for (const _ of db.query(`SELECT * FROM user WHERE username='${user.username}'`, []))
        userExist = true;
      
      if(!userExist) {
        db.query(
          "INSERT INTO user (id, username, password, nickname, token) VALUES (?, ?, ?, ?, ?)",
          [user.id, user.username, user.password, user.nickname, user.token]
        );
        await save(db);
      }
    } catch (error) {
      console.log(error);
    }

    if(!userExist) {
      response.status = 201;
      response.body = {
        success: true,
        data: user,
      };
    }else {
      response.status = 400;
      response.body = {
        success: false,
        msg: 'user with that username already exists!'
      }
    }
  }
};

export { addUser };
