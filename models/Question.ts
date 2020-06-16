import { DATA_TYPES, Model } from 'https://deno.land/x/denodb@v1.0.0/mod.ts';

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
                status: DATA_TYPES.INTEGER,
                finished: DATA_TYPES.INTEGER,
        };
        
        static defaults = {
                finished: 0,
        }
}

export default Question;