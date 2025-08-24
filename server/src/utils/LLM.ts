import { prompt } from "./prompts/categorizing_prompt";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, '../dotenv/.env') });
import { InferenceClient } from "@huggingface/inference";

export default class LLM {
    private static readonly HF_TOKEN = process.env.HF_TOKEN;
    private static readonly PROVIDER = "cerebras";
    private static readonly MODEL = "openai/gpt-oss-120b";

    private static readonly TRANSACTION_CATEGORIZER_SYSTEM_PROMPT = prompt;

    private static client: InferenceClient;

    static async getResponse(userPrompt: string) {
        try {
            this.client = new InferenceClient(this.HF_TOKEN);
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
        } catch (error) {
            console.error("Error getting response from LLM: ", error);
            throw error;
        }
    }

    static async categorizeTransactions(categories: string, transactions: string) {
        try {
            const categoriesJsonString = categories;
            const transactionsJsonString = transactions;
            const systemPrompt = this.TRANSACTION_CATEGORIZER_SYSTEM_PROMPT
                .replace('{categories_json_string}', categoriesJsonString)
                .replace('{transactions_json_string}', transactionsJsonString);
            const response = await this.getResponse(systemPrompt);
            if (response.content) {
                const transactions = this.parseJsonFromResponse(response.content);
                return transactions;
            }
            throw new Error("No content in response from LLM");
        } catch (error) {
            console.error("Error categorizing transactions: ", error);
            throw error;
        }
    }

    private static parseJsonFromResponse(text: string) {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find a valid JSON object in the model's response.");
        }
        return JSON.parse(text.substring(startIndex, endIndex + 1));
    }
}