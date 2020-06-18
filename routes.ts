import { Router } from 'https://deno.land/x/oak/mod.ts';
import {
	addUser,
	signIn,
	leaderboard,
	editNickname,
} from './controllers/users.ts';
import {
	addQuestion,
	getQuestions,
	toggleQuestions,
	editQuestion,
} from './controllers/questions.ts';
import {
	getFinishSubmissionCode,
	getSubmission,
	fetchSubmission,
	createSubmission,
	getSubmissionCode,
} from './controllers/submissions.ts';

const router = new Router();

router
	.post('/api/v1/register', addUser)
	.post('/api/v1/login', signIn)
	.post('/api/v1/nickname', editNickname)
	.get('/api/v1/leaderboard', leaderboard)
	.post('/api/v1/admin/lkmsicksanskc2213osi', addQuestion) // no secure at all ;-;
	.put('/api/v1/admin/skacmkmscaskmcs213', toggleQuestions)
	.put('/api/v1/admin/asxcsadwdascs213', editQuestion)
	.get('/api/v1/questions', getQuestions)
	.post('/api/v1/get_finish_code', getFinishSubmissionCode)
	.post('/api/v1/list_submission', getSubmission)
	.post('/api/v1/submission', fetchSubmission)
	.post('/api/v1/grader_check', createSubmission)
	.post('/api/v1/submission_code', getSubmissionCode);

export default router;
