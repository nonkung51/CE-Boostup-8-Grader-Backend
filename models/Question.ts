import { DATA_TYPES, Model } from 'https://deno.land/x/denodb/mod.ts';

class Question extends Model {
	static table = 'questions';

	static fields = {
        id: DATA_TYPES.STRING,
        title: DATA_TYPES.STRING,
        input: DATA_TYPES.STRING,
        output: DATA_TYPES.STRING,
        scorePerCase: DATA_TYPES.INTEGER,
        questionBody: DATA_TYPES.STRING,
        rank: DATA_TYPES.INTEGER,
        status: DATA_TYPES.INTEGER
	};
}

export default Question;