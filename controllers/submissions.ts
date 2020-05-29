import { v4 } from 'https://deno.land/std/uuid/mod.ts';

import { Submission } from '../types.ts';
import { SubmissionCode } from '../types.ts';
import {
	insertSubmissionCode,
	getUserIDFromToken,
	checkSubmissionExist,
	updateSubmissionCode,
} from '../database.ts';

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
		// TODO
		// then add to submission code
		const userId = await getUserIDFromToken({ token });
		// check if there's already code for (user, question) pair
		// if there is edit else create new one
		if (checkSubmissionExist({ userId, questionId })) {
			await updateSubmissionCode({ code, userId, questionId });
		} else {
			await insertSubmissionCode({
				code,
				userId,
				questionId,
				id: v4.generate(),
			});
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
	// { userId, questionId, score }
	const body = await request.body();

	if (!request.hasBody) {
		response.status = 400;
		response.body = {
			success: false,
			msg: 'No data.',
		};
	} else {
	}
};

// Flow
// Fetch to grader => grader fetch back => use that data to create new submission, submission code

export { fetchSubmission, createSubmission };
