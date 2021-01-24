export default class StockTraderMock {

  userLogin = async (credentials) => {
    await sleep(500); // Arbitrary sleep duration to mimic response time of server
    return new Promise((resolve, reject) => {
      if (credentials?.username !== '' && credentials?.password !== '') {
        resolve({ token: 'mock-jwt-token' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  }

  registerUser = async (credentials) => {
    await sleep(500); // Arbitrary sleep duration to mimic response time of server
    return new Promise((resolve, reject) => {
      if (credentials?.username !== '' || credentials?.password !== '') {
        resolve({ token: 'mock-jwt-token' });
      } else {
        reject(new Error('Unable to create account.'));
      }
    });
  }

}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
