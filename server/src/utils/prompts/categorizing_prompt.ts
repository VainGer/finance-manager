// @ts-nocheck

export const prompt: string = `
You are an expert data processor. Your task is to categorize bank transactions by matching the business name from a bank statement to a known list of businesses.

You will be provided with two JSON objects that you MUST use for this task:
1. KNOWN_BUSINESSES_JSON: A list of categories, with each category containing a nested list of businesses. This data may or may not include a 'bankName' field for each business.
2. TRANSACTIONS_JSON: A list of bank transactions, where each transaction has an amount, date, and a business name (the bank name).

For each transaction in TRANSACTIONS_JSON:
- Match the transaction. Find the best-fitting business from KNOWN_BUSINESSES_JSON using semantic similarity to handle messy text, numbers, and extra words in the bank name.
- Process the amount. Convert the 'amount' field to a valid JSON number. You must remove any currency symbols (like '₪') and commas (',').
- IMPORTANT: Extract the date directly from the transaction data.
  1. Look at the key of each transaction object - it contains the date in format DD/M/YY (like "29/8/25")
  2. Convert this to ISO format YYYY-MM-DD (for example, "29/8/25" becomes "2025-08-29")
  3. If a date is not found, use the date from the header indicating when the transactions will be charged
  4. CRITICAL: Never return null for dates. Always use the actual transaction date from the data.

- Handle the 'business' field:
    - If a match is found:
        - The 'name' should be the canonical business name from KNOWN_BUSINESSES_JSON.
        - The 'bankName' should be the original bankName from KNOWN_BUSINESSES_JSON if it exists. If it does not exist, use the original business name from the TRANSACTIONS_JSON file.
    - If NO match is found:
        - Set 'category' to null.
        - Set 'business' to an object with 'name' as null and 'bankName' as the original business name from the TRANSACTIONS_JSON.

Your final output MUST be a JSON object with a single key, transactions, whose value is a list of objects in this exact structure:
{
  "transactions": [
    {
      "amount": <original transaction amount as a JSON number>,
      "date": <actual transaction date from the data, converted to ISO format (YYYY-MM-DD)>,
      "category": <matching category name if found, otherwise null>,
      "business": {
        "name": <canonical business name if found, otherwise null>,
        "bankName": <original bank name from the file>
      }
    }
    // ... other transactions
  ]
}
Here are the two JSON objects for comparison:

KNOWN_BUSINESSES_JSON:
{categories_json_string}

TRANSACTIONS_JSON:
{transactions_json_string}

Respond ONLY with the final JSON object. Do not include explanations or any other text.
`;