import { Database } from 'https://deno.land/x/denodb@v1.0.0/mod.ts';

import User from './models/User.ts';
import Question from './models/Question.ts';
import Submission from './models/Submission.ts';
import SubmissionCode from './models/SubmissionCode.ts';

import { DATABASE_URI, DATABASE_NAME, DEBUG_MODE } from './config.js';

let db: Database;
if (DEBUG_MODE) {
	db = new Database('sqlite3', {
		filepath: './database.sqlite',
	});
} else {
	db = new Database('mongo', {
		uri: DATABASE_URI,
		database: DATABASE_NAME,
	});
}

db.link([User, Question, Submission, SubmissionCode]);
await db.sync();

console.log('Database connection established.');

////////////////////////// User ///////////////////////////////

const addScoreToUser = async ({
	userId,
	score,
}: {
	userId: string;
	score: number;
}) => {
	const user = await User.where('id', userId).first();
	let newScore = score + user.score;
	await User.where('id', userId).update('score', newScore);
};

const insertUser = async ({
	id,
	username,
	password,
	nickname,
	token,
	score,
}: {
	id: string;
	username: string;
	password: string;
	nickname: string;
	token: string;
	score: number;
}) => {
	await User.create({ id, username, password, nickname, token, score });
};

const getUserFromUsername = async ({ username }: { username: string }) => {
	let user: any = await User.where('username', username).first();
	return user;
};

const checkIfUserExisted = async ({ username }: { username: string }) => {
	let userExisted: boolean = false;
	let user: any = await User.where('username', username).first();
	if (user !== undefined) {
		userExisted = true;
	}
	return userExisted;
};

const getUserIDFromToken = async ({ token }: { token: string }) => {
	let user: any = await User.where('token', token).first();

	return user.id;
};

const renameUser = async ({
	token,
	nickname,
}: {
	token: string;
	nickname: string;
}) => {
	try {
		await User.where('token', token).update({ nickname });
	} catch (error) {
		console.log(error);
	}
};

const changeUserPassword = async ({
	token,
	password,
}: {
	token: string;
	password: string;
}) => {
	try {
		await User.where('token', token).update({ password });
	} catch (error) {
		console.log(error);
	}
};

const getLeaderboard = async () => {
	let users: any = await (
		await User.select('nickname', 'score').orderBy('score').all()
	).reverse();

	return users;
};

///////////////////////////// Submission //////////////////////////////////

const insertSubmission = async ({
	id,
	userId,
	questionId,
	score,
	time,
	result,
}: {
	id: string;
	userId: string;
	questionId: string;
	score: number;
	time: number;
	result: string;
}) => {
	await Submission.create({ id, userId, questionId, score, time, result });
};

const lookupSubmission = async ({ userId }: { userId: string }) => {
	let submissions = await Submission.where('userId', userId).get();
	submissions = await Promise.all(submissions.map(async (sub: any) => {
		const {
			input,
			scorePerCase,
		}: {
			input: string;
			scorePerCase: number;
		} = await getQuestionFromID({ id: sub.questionId });
		const maxScore: number =
			input.split('$.$').length * scorePerCase;
		return { ...sub, maxScore };
	}))
	return submissions;
};

///////////////////////////// Submission Code /////////////////////////

const getFinishedSubmissionCodeByQuestionId = async ({
	questionId,
}: {
	questionId: string;
}) => {
	const submissionCode = await SubmissionCode.where('questionId', questionId)
		.where('finished', true)
		.all();
	return submissionCode;
};

const insertSubmissionCode = async ({
	id,
	userId,
	questionId,
	code,
}: {
	id: string;
	userId: string;
	questionId: string;
	code: string;
}) => {
	await SubmissionCode.create({ id, userId, questionId, code });
};

const getScoreByQuestion = async ({
	userId,
	questionId,
}: {
	userId: string;
	questionId: string;
}) => {
	const submissions = await Submission.where('userId', userId)
		.where('questionId', questionId)
		.all();
	let max = 0;
	submissions.map(({ score }: { score: number }) => {
		if (max < score) {
			max = score;
		}
	});

	return max;
};

const checkSubmissionExist = async ({
	userId,
	questionId,
}: {
	userId: string;
	questionId: string;
}) => {
	const submissionCode = await SubmissionCode.where('userId', userId)
		.where('questionId', questionId)
		.first();
	if (submissionCode) {
		return true;
	}
	return false;
};

const updateSubmissionCode = async ({
	userId,
	questionId,
	code,
	finished,
}: {
	userId: string;
	questionId: string;
	code: string;
	finished: boolean;
}) => {
	if (finished) {
		await SubmissionCode.where('userId', userId)
			.where('questionId', questionId)
			.update({ finished });
	} else {
		await SubmissionCode.where('userId', userId)
			.where('questionId', questionId)
			.update({ code });
	}
};

const lookupSubmissionCode = async ({
	userId,
	questionId,
}: {
	userId: string;
	questionId: string;
}) => {
	const submissionCode = await SubmissionCode.where('userId', userId)
		.where('questionId', questionId)
		.get();
	return submissionCode;
};

///////////////////////////// Question ////////////////////////////////

const insertQuestion = async ({
	id,
	title,
	input,
	output,
	scorePerCase,
	questionBody,
	rank,
	status,
	types,
}: {
	id: string;
	title: string;
	input: string;
	output: string;
	scorePerCase: number;
	questionBody: string;
	rank: number;
	status: number;
	types: string;
}) => {
	await Question.create({
		id,
		title,
		input,
		output,
		scorePerCase,
		questionBody,
		rank,
		status,
		types,
	});
};

const updateQuestion = async ({
	id,
	title,
	input,
	output,
	scorePerCase,
	questionBody,
	rank,
	status,
	types,
}: {
	id: string;
	title: string;
	input: string;
	output: string;
	scorePerCase: number;
	questionBody: string;
	rank: number;
	status: number;
	types: string;
}) => {
	await Question.where('id', id).update({
		title,
		input,
		output,
		scorePerCase,
		questionBody,
		rank,
		status,
		types,
	});
};

const listQuestion = async () => {
	const questions = await Question.select(
		'finished',
		'id',
		'title',
		'scorePerCase',
		'questionBody',
		'rank',
		'status',
		'types'
	).all();
	return questions;
};

const listQuestionGrader = async () => {
	const questions = await Question.select(
		'id',
		'input',
		'output'
	).all();
	return questions;
};

const getQuestionFromID = async ({ id }: { id: string }) => {
	const question = await Question.where('id', id).first();
	return question;
};

const toggleQuestionActive = async ({ id }: { id: string }) => {
	let { status } = await Question.select('status').where('id', id).first();
	if (status == 1) {
		status = 0;
	} else if (status == 0) {
		status = 1;
	}
	await Question.where('id', id).update('status', status);
};

const addSuccessSubmission = async ({ id }: { id: string }) => {
	const { finished }: { finished: number } = await Question.select(
		'finished'
	)
		.where('id', id)
		.first();
	await Question.where('id', id).update('finished', finished + 1);
};

// Statistics
const getStats = async ({ userId }: { userId: string }) => {
	function isFullScore(str: string) {
		if (
			str.split('-').length === 1 &&
			str.split('X').length === 1 &&
			str.split('T').length === 1
		) {
			return true;
		}
		return false;
	}
	const { score }: { score: number } = await User.where(
		'id',
		userId
	).first();
	const submissions: [any] = await Submission.select('time', 'result')
		.where('userId', userId)
		.get();
	let sigmaTime = 0,
		fullScoreSubmit = 0,
		submit = 0;
	submissions.forEach(
		({ time, result }: { time: number; result: string }) => {
			sigmaTime += time;
			submit += 1;
			if (isFullScore(result)) {
				fullScoreSubmit += 1;
			}
		}
	);
	return { sigmaTime, submit, fullScoreSubmit, score };
};

const getAllStats = async () => {
	const users = await User.select('id', 'nickname').get();
	const stats: any[] = await Promise.all(
		users.map(
			async ({ id, nickname }: { id: string; nickname: string }) => {
				const stat = await getStats({ userId: id });
				return { id, nickname, ...stat };
			}
		)
	);
	return stats;
};

export {
	insertUser,
	renameUser,
	checkIfUserExisted,
	getUserFromUsername,
	getUserIDFromToken,
	changeUserPassword,
	insertSubmission,
	insertQuestion,
	updateQuestion,
	listQuestion,
	listQuestionGrader,
	toggleQuestionActive,
	insertSubmissionCode,
	checkSubmissionExist,
	updateSubmissionCode,
	lookupSubmissionCode,
	lookupSubmission,
	getLeaderboard,
	getQuestionFromID,
	getScoreByQuestion,
	addScoreToUser,
	addSuccessSubmission,
	getFinishedSubmissionCodeByQuestionId,
	getStats,
	getAllStats,
};
