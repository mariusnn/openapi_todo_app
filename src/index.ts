import { makeApp } from "./_generatedManually/server";
import { TodoApplication } from "./app/todoApp";
import { AppDecoders } from "./app/authorizer";

const PORT = process.env.PORT || 3000;

const application = new TodoApplication();
const server = makeApp(AppDecoders, application)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});