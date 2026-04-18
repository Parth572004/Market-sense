import { translateTexts } from '../services/translationService.js';
import { translateBodySchema } from '../validators/schemas.js';

export async function translate(req, res, next) {
  try {
    const body = translateBodySchema.parse(req.body);
    const translations = await translateTexts(body.texts, {
      targetLanguage: body.targetLanguage,
      sourceLanguage: body.sourceLanguage
    });

    res.json({
      targetLanguage: body.targetLanguage,
      sourceLanguage: body.sourceLanguage,
      translations
    });
  } catch (error) {
    next(error);
  }
}
