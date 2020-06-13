import { DATA_TYPES, Model } from 'https://deno.land/x/denodb/mod.ts';

class Submission extends Model {
	static table = 'submissions';

	static fields = {
		id: DATA_TYPES.STRING,
		userId: DATA_TYPES.STRING,
		questionId: DATA_TYPES.STRING,
		score: DATA_TYPES.INTEGER,
		time: DATA_TYPES.INTEGER,
		result: DATA_TYPES.STRING,
	};
}

export default Submission;

// id TEXT PRIMARY KEY UNIQUE, user_id TEXT, question_id TEXT, score INTEGER
