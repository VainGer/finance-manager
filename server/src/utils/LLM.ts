import dotenv from "dotenv";
import path from "path";
// Configure dotenv at the very start
dotenv.config({ path: path.join(__dirname, '../dotenv/.env') });
import { InferenceClient } from "@huggingface/inference";

export default class LLM {
    private static readonly HF_TOKEN = process.env.HF_TOKEN;
    private static readonly PROVIDER = "featherless-ai";
    private static readonly MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

    private static readonly TRANSACTION_CATEGORIZER_SYSTEM_PROMPT = `You are an expert data processor. Your task is to categorize bank transactions by matching the business name from a bank statement to a known list of businesses.

You will be provided with two JSON objects:
1.  \`KNOWN_BUSINESSES_JSON\`: A list of categories, with each category containing a nested list of businesses.
2.  \`TRANSACTIONS_JSON\`: A list of bank transactions, where each transaction has an amount, date and the business name from the bank statement.

For each transaction in \`TRANSACTIONS_JSON\`, you must find the best-matching business from the \`KNOWN_BUSINESSES_JSON\`. Your matching should be smart and semantic, as the names in the bank statements are often messy and contain extra text (e.g., store numbers).

Your final output MUST be a JSON object with a single key, \`transactions\`, which is a list of objects. Each object in this list must have the following structure:
{
  "amount": <the original transaction amount>,
  "date": <the original transaction date in ISO format>,
  "category": <the name of the matching category>,
  "business": {
    "name": <the canonical business name from KNOWN_BUSINESSES_JSON>,
    "bankName": <the original business name from TRANSACTIONS_JSON>
  }
}

If a transaction's business name cannot be reliably matched to any known business, set the \`category\` and \`business\` to \`null\`.

Here are the two JSON objects for comparison:

KNOWN_BUSINESSES_JSON:
{categories_json_string}

TRANSACTIONS_JSON:
{transactions_json_string}

Provide only the final JSON object. Do not include any other text, explanations, or code blocks.
`;

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
                const categories = JSON.parse(response.content).categories;
                return this.parseJsonFromResponse(categories);
            }
            throw new Error("No content in response from LLM");
        } catch (error) {
            console.error("Error categorizing transactions: ", error);
            throw error;
        }
    }

    private static parseJsonFromResponse(text: string) {
        console.log(text);
        const parsedResponse = JSON.parse(text);
        const startIndex = parsedResponse.indexOf('{');
        const endIndex = parsedResponse.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find a valid JSON object in the model's response.");
        }
        return JSON.parse(parsedResponse.substring(startIndex, endIndex + 1));
    }
}