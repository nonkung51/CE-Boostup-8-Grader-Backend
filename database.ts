import { open, save } from 'https://deno.land/x/sqlite/mod.ts';

const db = await open('test.db');
db.query(
	`CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY UNIQUE, username TEXT UNIQUE, password TEXT, nickname TEXT, token TEXT, score INTEGER)`,
	{}
);
db.query(
	`CREATE TABLE IF NOT EXISTS submission (id TEXT PRIMARY KEY UNIQUE, user_id TEXT, question_id TEXT, score INTEGER)`,
	{}
);
db.query(
	`CREATE TABLE IF NOT EXISTS question (id TEXT PRIMARY KEY UNIQUE, title TEXT, input TEXT, output TEXT, score_per_case INT, question_body TEXT, rank INTEGER, status INTEGER)`,
	{}
);
await save(db);

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
	db.query(
		'INSERT INTO user (id, username, password, nickname, token, score) VALUES (?, ?, ?, ?, ?, ?)',
		[id, username, password, nickname, token, score]
	);
	await save(db);
};

const getUserFromUsername = async ({ username }: { username: string }) => {
	let user: any;
	for (const u of db.query(
		`SELECT * FROM user WHERE username='${username}'`,
		[]
	)) {
		user = u;
		break;
	}

	return user;
};

const checkIfUserExisted = async ({ username }: { username: string }) => {
	let userExisted: boolean = false;
	for (const _ of db.query(
		`SELECT * FROM user WHERE username='${username}'`,
		[]
	)) {
		userExisted = true;
		break;
	}
	return userExisted;
};

const getUserIDFromToken = async ({ token }: { token: string }) => {
	let userID: string | null = null;
	for (const u of db.query(
		`SELECT id FROM user WHERE token='${token}'`,
		[]
	)) {
		userID = u[0];
		break;
	}
	return userID;
};

///////////////////////////// Submission //////////////////////////////////

const insertSubmission = async ({
	id,
	userId,
	questionId,
	score,
}: {
	id: string;
	userId: string;
	questionId: string;
	score: number;
}) => {
	db.query(
		'INSERT INTO submission (id, user_id, question_id, score) VALUES (?, ?, ?, ?)',
		[id, userId, questionId, score]
	);
	await save(db);
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
	try {
		db.query(
			'INSERT INTO question (id, title, input, output, score_per_case, question_body, rank, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id,
				title,
				input,
				output,
				scorePerCase,
				questionBody,
				rank,
				status,
			]
		);
		await save(db);
	} catch (error) {
		console.log(error);
	}
};

const listQuestion = async () => {
	const questions = [];
	for (const q of db.query('SELECT * FROM question', [])) {
		questions.push(q);
	}
	return questions;
};

const toggleQuestionActive = async ({ id }: { id: string }) => {
	let status: number | undefined;
	for (const q of db.query('SELECT id, status FROM question', [])) {
		console.log(q[0] + ' === ' + id);
		if(q[0] == id) {
			status = q[1];
		}	
	}
	if(status === 1) status = 0;
	else if(status === 0) status = 1;
	db.query(`UPDATE question SET status=${status} WHERE id='${id}'`, {});
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
};
