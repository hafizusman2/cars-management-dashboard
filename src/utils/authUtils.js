// Store the token in local storage
const storeToken = (token) => {
  try {
    localStorage.setItem('access_token', token);
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
    }
  } catch (error) {
    console.log('Error retrieving token: ', error);
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

// Check if the user is authenticated
const isAuthenticated = () => {
  // Check if the token exists to determine the authentication status
  const token = getToken();
  return token !== null;
};

module.exports = {
  storeToken,
  getToken,
  removeToken,
  isAuthenticated,
};
