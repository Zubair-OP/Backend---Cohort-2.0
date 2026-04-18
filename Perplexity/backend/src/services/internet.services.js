import {tavily as Tavily} from "@tavily/core";

let tavilyClient = null;

export function isInternetSearchAvailable() {
    return Boolean(process.env.TAVILY_API_KEY?.trim());
}

function getTavilyClient() {
    const apiKey = process.env.TAVILY_API_KEY?.trim();

    if (!apiKey) {
        const error = new Error("Missing TAVILY_API_KEY in environment.");
        error.status = 500;
        throw error;
    }

    if (!tavilyClient) {
        tavilyClient = Tavily({ apiKey });
    }

    return tavilyClient;
}

export const internetSearch = async ({query}) => {
    const response = await getTavilyClient().search(query, {
        maxResults: 5
    });
    return response.results.map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join('\n\n');
}
