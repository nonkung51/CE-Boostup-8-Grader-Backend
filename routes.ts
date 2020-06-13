import { Router } from 'https://deno.land/x/oak/mod.ts';
<<<<<<< Updated upstream
import { addUser, signIn } from './controllers/users.ts';
=======
import { addUser, signIn, leaderboard, editNickname } from './controllers/users.ts';
>>>>>>> Stashed changes
import {
	addQuestion,
	getQuestions,
	toggleQuestions,
} from './controllers/questions.ts';
import { getSubmission, fetchSubmission, createSubmission, getSubmissionCode } from './controllers/submissions.ts';

const router = new Router();

router
	.post('/api/v1/register', addUser)
	.post('/api/v1/login', signIn)
<<<<<<< Updated upstream
=======
	.post('/api/v1/nickname', editNickname)
	.get('/api/v1/leaderboard', leaderboard)
>>>>>>> Stashed changes
	.post('/api/v1/admin/lkmsicksanskc2213osi', addQuestion) // no secure at all ;-;
	.put('/api/v1/admin/skacmkmscaskmcs213', toggleQuestions)
	.get('/api/v1/questions', getQuestions)
	.post('/api/v1/list_submission', getSubmission)
	.post('/api/v1/submission', fetchSubmission)
	.post('/api/v1/grader_check', createSubmission)
	.post('/api/v1/submission_code', getSubmissionCode);

export default router;
