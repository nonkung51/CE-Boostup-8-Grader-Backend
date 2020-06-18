import { Database } from 'https://deno.land/x/denodb@v1.0.0/mod.ts';

import User from './models/User.ts';
import Question from './models/Question.ts';
import Submission from './models/Submission.ts';
import SubmissionCode from './models/SubmissionCode.ts';

const db = new Database('mongo', {
	uri: 'mongodb://127.0.0.1:27017',
	database: 'test',
});
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
	const submissions = await Submission.where('userId', userId).get();
	return submissions;
};

///////////////////////////// Submission Code /////////////////////////

const getSubmissionCodeById = async ({
	questionId,
}: {
	questionId: string;
}) => {
	const submissionCode = await SubmissionCode.where('questionId', questionId).all();
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
	const questions = await Question.all();
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

export {
	insertUser,
	renameUser,
	checkIfUserExisted,
	getUserFromUsername,
	getUserIDFromToken,
	insertSubmission,
	insertQuestion,
	updateQuestion,
	listQuestion,
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
	getSubmissionCodeById,
};
