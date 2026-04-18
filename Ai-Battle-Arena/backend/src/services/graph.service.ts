import { StateGraph, START , END , StateSchema, type GraphNode} from "@langchain/langgraph";
import z from 'zod';
import { geminiModel, groqModel, openRouterModel } from "./model.services.js";
import { createAgent,providerStrategy, HumanMessage } from "langchain";


const graphSchema = z.object({
    problem: z.string().default(""),
    soultion_1: z.string().default(""),
    soultion_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    })
})


const solutionNode: GraphNode<  typeof graphSchema > = async (state) => {
    const [solution_1, solution_2] = await Promise.all([
        openRouterModel.invoke(state.problem),
        groqModel.invoke(state.problem),
    ])

    return {
        solution_1: solution_1.text,
        solution_2: solution_2.text,
    } 
}


const judgeNode: GraphNode<typeof graphSchema> = async (state) => {
    const { problem, solution_1, solution_2 } = state


const judge = createAgent({
    model:geminiModel,
    responseFormat:providerStrategy(z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string(),
    })),
    systemPrompt: `You are a Judge tasked with evaluating two solutions to a problem. 
    Rate each solution on a scale of 0 to 10 based on correctness, efficiency, and clarity.
    Provide a detailed reasoning for each score.`
})


const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(`
                Problem: ${problem}
                Solution 1: ${solution_1}
                Solution 2: ${solution_2}
                Please evaluate the solutions and provide scores and reasoning.
                `)
        ]
    })


const {
        solution_1_score,
        solution_2_score,
        solution_1_reasoning,
        solution_2_reasoning
    } = 
    
    judgeResponse.structuredResponse

 return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning
        }
    }
}


const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile()


export default async function (problem: string) { 

    const result = await graph.invoke({
        problem: problem
    })

    return result

}    