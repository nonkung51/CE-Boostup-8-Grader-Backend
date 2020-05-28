import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { Question } from '../types.ts';
import { insertQuestion, listQuestion, toggleQuestionActive } from '../database.ts';

// @desc    Add submission
// @route   Post /api/v1/submit
const addQuestion = async ({
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
		const question: Question = body.value;
        question.id = v4.generate();
        await insertQuestion(question);
        response.status = 201
        response.body = {
            success: true,
            data: question,
        }
	}
};

// @desc    Get all questions
// @route   GET /api/v1/questions
const getQuestions = async ({ response }: { response: any }) => {
    const questions = await listQuestion();
    response.body = {
        success: true,
        data: questions
    }
}


// @desc    Update question status
// @route   
const toggleQuestions = async ({
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
        const { id } = body.value;
        await toggleQuestionActive({id});
        response.status = 201
        response.body = {
            success: true,
        }
    }
}

export { addQuestion, getQuestions, toggleQuestions };
