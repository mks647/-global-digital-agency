
const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your admin password: ", async (password) => {
  try {
    if (password.length < 12) {
      console.log("Password must be at least 12 characters.");
    } else {
      const hash = await bcrypt.hash(password, 12);
      console.log("\nYour password hash:\n");
      console.log(hash);
      console.log("\nCopy this hash and save it privately.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    rl.close();
  }
});
