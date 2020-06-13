import { Database } from 'https://deno.land/x/denodb/mod.ts';

import User from './models/User.ts';
import Question from './models/Question.ts';
import Submission from './models/Submission.ts';
import SubmissionCode from './models/SubmissionCode.ts';

const db = new Database('sqlite3', {
	filepath: './database.sqlite',
});
db.link([User, Question, Submission, SubmissionCode]);
await db.sync();

console.log('Database connection established.');

////////////////////////// User ///////////////////////////////

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

const getLeaderboard = async () => {
	let users: any = await (await User.select('nickname', 'score').orderBy('score').all()).reverse();

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
	const submissions = await Submission.where('userId', userId).get();
	return submissions;
};

///////////////////////////// Submission Code /////////////////////////

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
}: {
	userId: string;
	questionId: string;
	code: string;
}) => {
	await SubmissionCode.where('userId', userId)
		.where('questionId', questionId)
		.update({ code });
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
}: {
	id: string;
	title: string;
	input: string;
	output: string;
	scorePerCase: number;
	questionBody: string;
	rank: number;
	status: number;
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
	});
};

const listQuestion = async () => {
	const questions = await Question.all();
	return questions;
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

export {
	insertUser,
	checkIfUserExisted,
	getUserFromUsername,
	getUserIDFromToken,
	insertSubmission,
	insertQuestion,
	listQuestion,
	toggleQuestionActive,
	insertSubmissionCode,
	checkSubmissionExist,
	updateSubmissionCode,
	lookupSubmissionCode,
	lookupSubmission,
	getLeaderboard
};
