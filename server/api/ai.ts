import {
  createOpenAIModel,
  generateChatResponse,
} from "../services/ai.service";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const model = createOpenAIModel(config.openaiApiKey);

  const body = await readBody(event);
  const { messages } = body;

  const id = messages.length.toString();

  const response = await generateChatResponse(model, messages);

  return {
    id,
    role: "assistant",
    content: response,
  };
});
