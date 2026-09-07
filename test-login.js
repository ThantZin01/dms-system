const { auth } = require('./src/lib/auth');
async function test() {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: 'test@dorm.com',
        password: 'password123' // Or whatever the user typed? Wait, I don't know the password
      }
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
