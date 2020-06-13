import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

import { User } from '../types.ts';
import {
	insertUser,
	checkIfUserExisted,
	getUserFromUsername,
	getLeaderboard,
} from '../database.ts';

// @desc    Add user
// @route   Post /api/v1/register
const addUser = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const user: User = body.value;
		user.id = v4.generate();
		user.token = v4.generate();
		user.score = 0;
		user.password = await bcrypt.hash(user.password);
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
				msg: 'user with that username already exists!',
			};
		}
	}
};

// @desc    sign in
// @route   Post /api/v1/login
const signIn = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const { username, password } = body.value;

	if (!request.hasBody || !(await checkIfUserExisted({ username }))) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data or User is not existed.',
		};
	} else {
		const dbUser = await getUserFromUsername({ username });
		if (await bcrypt.compare(password, dbUser.password)) {
			response.status = 200;
			response.body = {
				success: true,
				token: dbUser.token,
			};
		} else {
			response.status = 400;
			response.body = {
				success: false,
				msg: 'password incorrect.',
			};
		}
	}
};

const leaderboard = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const users = await getLeaderboard();

	response.status = 200;
	response.body = {
		success: true,
		users,
	};
};

export { addUser, signIn, leaderboard };
