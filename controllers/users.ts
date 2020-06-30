import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

import { User } from '../types.ts';
import {
	insertUser,
	checkIfUserExisted,
	getUserFromUsername,
	getLeaderboard,
	renameUser,
	getUserIDFromToken,
	getStats,
	getAllStats,
	changeUserPassword,
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
		const dbUser: User = await getUserFromUsername({ username });
		const {
			token,
			nickname,
		}: { token: string; nickname: string } = dbUser;
		if (await bcrypt.compare(password, dbUser.password)) {
			response.status = 200;
			response.body = {
				success: true,
				user: {
					token,
					nickname,
				},
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

const editNickname = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const {
		token,
		nickname,
	}: { token: string; nickname: string } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		await renameUser({ token, nickname });

		response.status = 200;
		response.body = {
			success: true,
			msg: `Success changing name to ${nickname}.`,
		};
	}
};

const changePassword = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const {
		token,
		password,
	}: { token: string; password: string } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const hashPassword = await bcrypt.hash(password)
		await changeUserPassword({ token, password: hashPassword });

		response.status = 200;
		response.body = {
			success: true,
			msg: `Success changing password.`,
		};
	}
};

const getUserStats = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const {
		token,
	}: { token: string; } = body.value;

	const userId = await getUserIDFromToken({ token });
	const stats = await getStats({ userId });

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		response.status = 200;
		response.body = {
			success: true,
			data: stats,
		};
	}
};

const getUsersStats = async ({ response }: { response: any }) => {
	const stats = await getAllStats();
	response.status = 200;
	response.body = {
		success: true,
		data: stats
	}
}

export { addUser, signIn, leaderboard, editNickname, getUserStats, getUsersStats, changePassword };
