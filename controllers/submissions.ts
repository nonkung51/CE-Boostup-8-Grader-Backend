import { v4 } from 'https://deno.land/std/uuid/mod.ts';

import {
	insertSubmissionCode,
	getUserIDFromToken,
	checkSubmissionExist,
	updateSubmissionCode,
	insertSubmission,
	lookupSubmissionCode,
	lookupSubmission,
	getQuestionFromID,
	getScoreByQuestion,
	addScoreToUser,
	addSuccessSubmission,
	getSubmissionCodeById
} from '../database.ts';

const getSubmissionCode = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const { token, questionId } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const userId: string = await getUserIDFromToken({ token });
		const submissionCode = await lookupSubmissionCode({
			userId,
			questionId,
		});

		response.status = 200;
		response.body = {
			success: true,
			data: submissionCode,
		};
	}
};

const getFinishSubmissionCode = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const { token, questionId } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const userId = await getUserIDFromToken({ token });
		const {
			input,
			scorePerCase,
		}: {
			input: string;
			scorePerCase: number;
		} = await getQuestionFromID({ id: questionId });
		const maxScore: number =
			input.split('$.$').length * scorePerCase;
		let userScore: number = await getScoreByQuestion({ userId, questionId });
		if(userScore === maxScore) {
			const submissionCode = await getSubmissionCodeById({ questionId });

			response.status = 200;
			response.body = {
				success: true,
				data: submissionCode
			};
		} else {
			response.status = 400;
			response.body = {
				success: false,
				msg: 'You are not allowed.',
			};
		}
	}
}

// @desc    Add submission
// @route   Post /api/v1/submit
// { code, token(user), questionId }
const fetchSubmission = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const {
		code,
		questionId,
		token,
	}: { code: string; questionId: string; token: string } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const userId = await getUserIDFromToken({ token });
		const { input, output, scorePerCase } = await getQuestionFromID({
			id: questionId,
		});
		const body = {
			questionId,
			userId,
			sourceCode: code,
			input,
			output,
			scorePerCase,
		};
		await fetch('http://localhost:3456/compiler', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});
		console.log('fetch to compile (grader)');
		// TODO
		// then add to submission code
		try {
			const userId = await getUserIDFromToken({ token });
			// check if there's already code for (user, question) pair
			// if there is edit else create new one
			if (await checkSubmissionExist({ userId, questionId })) {
				await updateSubmissionCode({ code, userId, questionId });
			} else {
				await insertSubmissionCode({
					code,
					userId,
					questionId,
					id: v4.generate(),
				});
			}
		} catch (error) {
			console.log(error);
		}

		response.status = 200;
		response.body = {
			success: true,
			msg: 'Code submitted to server.',
		};
	}
};

const createSubmission = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	// { userId, questionId, score, result, time }
	const body = await request.body();
	const {
		userId,
		questionId,
		score,
		result,
		time,
	}: {
		userId: string;
		questionId: string;
		score: number;
		time: number;
		result: string;
	} = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		try {
			let before = await getScoreByQuestion({ userId, questionId });
			await insertSubmission({
				id: v4.generate(),
				userId,
				questionId,
				score,
				result,
				time,
			});
			let after = await getScoreByQuestion({ userId, questionId });
			const diff: number = after - before;
			const {
				input,
				scorePerCase,
			}: {
				input: string;
				scorePerCase: number;
			} = await getQuestionFromID({ id: questionId });
			const maxScore: number =
				input.split('$.$').length * scorePerCase;
			if (maxScore === after && diff != 0) {
				await addSuccessSubmission({ id: questionId });
			}
			if (diff > 0) {
				await addScoreToUser({ userId, score: diff });
			}
		} catch (error) {
			console.log(error);
		}

		response.status = 200;
		response.body = {
			success: true,
		};
	}
};

const getSubmission = async ({
	request,
	response,
}: {
	request: any;
	response: any;
}) => {
	const body = await request.body();
	const { token } = body.value;

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
		const userId: string = await getUserIDFromToken({ token });
		const submissions = await lookupSubmission({ userId });
		response.status = 200;
		response.body = {
			success: true,
			data: submissions,
		};
	}
};

// Flow
// Fetch to grader => grader fetch back => use that data to create new submission, submission code

export { fetchSubmission, createSubmission, getSubmissionCode, getSubmission, getFinishSubmissionCode };
