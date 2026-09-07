import { createAccountAction } from "./src/actions/accounts";

async function main() {
  const res = await createAccountAction({
    name: "Manual Test",
    email: "manual@dorm.com",
    password: "password123",
    role: "STUDENT"
  });
  console.log(res);
}
main();
