import { v4 } from 'https://deno.land/std/uuid/mod.ts';

import {
	insertSubmissionCode,
	getUserIDFromToken,
	checkSubmissionExist,
	updateSubmissionCode,
	insertSubmission,
	lookupSubmissionCode,
	lookupSubmission
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
		// send code to server
		// fetch('http://localhost:3456/compile')
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
			insertSubmission({
				id: v4.generate(),
				userId,
				questionId,
				score,
				result,
				time,
			});
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
		const submissions = await lookupSubmission({userId});
		response.status = 200;
		response.body = {
			success: true,
			data: submissions
		};
	}
};

// Flow
// Fetch to grader => grader fetch back => use that data to create new submission, submission code

export { fetchSubmission, createSubmission, getSubmissionCode, getSubmission };
