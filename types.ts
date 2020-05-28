export interface User {
	id: string;
	username: string;
	password: string;
	nickname: string;
	token: string;
	score: number;
}

export interface Submission {
	id: string;
	userId: string;
	questionId: string;
	score: number;
}

export interface SubmissionCode {
	id: string;
	userId: string;
	questionId: string
	code: string;
}

export interface Question {
	id: string;
	title: string;
	input: string;
	output: string;
	scorePerCase: number;
	questionBody: string;
	rank: number;
	status: number;
}
