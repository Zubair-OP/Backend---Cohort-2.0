import { Socket } from "socket.io";
import { HumanMessage } from "@langchain/core/messages";
import z from "zod";

import {
    geminiModel,
    mistralAIModel,
    GroqModel
} from "../services/model.services.js";



async function streamModelResponse(
    model: any,
    prompt: string,
    socket: Socket,
    eventName: string
) {

    let finalText = "";

    const stream = await model.stream(prompt);

    for await (const chunk of stream) {

        const token =
            typeof chunk.content === "string"
                ? chunk.content
                : String(chunk.content);

        finalText += token;

        socket.emit(eventName, {
            token
        });
    }

    return finalText;
}



export async function runGraphStreaming(
    problem: string,
    socket: Socket
) {

    socket.emit("ai_start");

    const [solution1, solution2] = await Promise.all([

        streamModelResponse(
            geminiModel,
            problem,
            socket,
            "gemini_token"
        ),

        streamModelResponse(
            mistralAIModel,
            problem,
            socket,
            "mistral_token"
        )
    ]);



    socket.emit("judge_start");



    const judgeSchema = z.object({
        solution_1_score: z.number(),
        solution_2_score: z.number(),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
    });

    const judge = GroqModel.withStructuredOutput(judgeSchema);

    const judgeResponse = await judge.invoke([
        new HumanMessage(`
        You are an expert AI judge. Evaluate both responses to the given problem and assign a score out of 10 to each.

        Scoring criteria:
        - Accuracy & correctness (is the answer factually right?)
        - Clarity & structure (is it easy to understand and well-organized?)
        - Completeness (does it fully address the problem?)
        - Conciseness (does it avoid unnecessary filler?)

        For each response, provide a "reasoning" field that explains your score based on the criteria above.
        The reasoning must be your OWN judge commentary — do NOT repeat the solution text.
        Keep it brief: 1 short sentence only. Mention the key strength or weakness.

        Problem: ${problem}

        Solution 1 (Gemini):
        ${solution1}

        Solution 2 (Mistral):
        ${solution2}
        `)
    ]);



    socket.emit("judge_complete", {
        result: judgeResponse
    });



    socket.emit("ai_complete");
}