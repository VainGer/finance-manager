"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categorizing_prompt_1 = require("./prompts/categorizing_prompt");
const coach_prompt_1 = require("./prompts/coach_prompt");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../dotenv/.env') });
const inference_1 = require("@huggingface/inference");
class LLM {
    static HF_TOKEN = process.env.HF_TOKEN;
    static PROVIDER = "cerebras";
    static MODEL = "openai/gpt-oss-120b";
    static TRANSACTION_CATEGORIZER_SYSTEM_PROMPT = categorizing_prompt_1.prompt;
    static client;
    static async getResponse(userPrompt) {
        try {
            this.client = new inference_1.InferenceClient(this.HF_TOKEN);
            const response = await this.client.chatCompletion({
                provider: this.PROVIDER,
                model: this.MODEL,
                messages: [
                    {
                        role: "user",
                        content: userPrompt,
                        max_new_tokens: 4096,
                        temperature: 0.1,
                        top_p: 0.95
                    }
                ]
            });
            return response.choices[0].message;
        }
        catch (error) {
            console.error("Error getting response from LLM: ", error);
            throw error;
        }
    }
    static async categorizeTransactions(categories, transactions) {
        try {
            const categoriesJsonString = categories;
            const transactionsJsonString = transactions;
            const systemPrompt = this.TRANSACTION_CATEGORIZER_SYSTEM_PROMPT
                .replace('{categories_json_string}', categoriesJsonString)
                .replace('{transactions_json_string}', transactionsJsonString);
            const response = await this.getResponse(systemPrompt);
            if (response.content) {
                const parsedResult = this.parseJsonFromResponse(response.content);
                return parsedResult;
            }
            throw new Error("No content in response from LLM");
        }
        catch (error) {
            console.error("Error categorizing transactions: ", error);
            throw error;
        }
    }
    static async generateCoachAdvice(budgetDataJson) {
        try {
            const prompt = coach_prompt_1.coachPrompt.replace("{budget_json}", budgetDataJson);
            const response = await this.getResponse(prompt);
            if (response.content) {
                return this.parseJsonFromResponse(response.content);
            }
            throw new Error("No content in response from LLM");
        }
        catch (error) {
            console.error("Error generating coach advice: ", error);
            throw error;
        }
    }
    static parseJsonFromResponse(text) {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find a valid JSON object in the model's response.");
        }
        return JSON.parse(text.substring(startIndex, endIndex + 1));
    }
}
exports.default = LLM;
//# sourceMappingURL=LLM.js.map