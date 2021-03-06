export default class StockTraderMock {

  userLogin = async (credentials) => {
    await sleep(500); // Arbitrary sleep duration to mimic response time of server
    return new Promise((resolve, reject) => {
      if (credentials?.username !== '' && credentials?.password !== '') {
        resolve({ "access_token": "Bearer 1234" });
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  }

  userSignup = async (credentials) => {
    await sleep(500); // Arbitrary sleep duration to mimic response time of server
    return new Promise((resolve, reject) => {
      if (credentials?.username !== '' || credentials?.password !== '') {
        resolve({ "access_token": "Bearer 1234" });
      } else {
        reject(new Error('Unable to create account.'));
      }
    });
  }

}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
