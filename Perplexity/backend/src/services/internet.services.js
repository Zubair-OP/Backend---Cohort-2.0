import {tavily as Tavily} from "@tavily/core";

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY
});

export const internetSearch = async ({query}) => {
    const response = await tavily.search(query, {
        maxResults: 5
    });
    return response.results.map(r => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join('\n\n');
}