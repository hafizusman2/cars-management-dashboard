// Store the token in local storage
const storeToken = (token) => {
  try {
    localStorage.setItem('access_token', token);
    console.log('Token stored');
  } catch (error) {
    console.log('Error storing token: ', error);
  }
};

// Retrieve the token from local storage
const getToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (token !== null) {
      return token;
    } else {
      console.log('Token not found in storage.');
      return null;
    }
  } catch (error) {
    console.log('Error retrieving token: ', error);
    return null;
  }
};

// remove token
const removeToken = () => {
  try {
    localStorage.removeItem('access_token');
  } catch (error) {
    console.log('Error removing token: ', error);
  }
};

module.exports = {
  storeToken,
  getToken,
  removeToken,
};
