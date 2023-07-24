  // src/components/Login/__mocks__/google.js

  const SCOPES = "email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.announcements"

  const mockGoogleAccountsId = {
    initialize: jest.fn(),
    renderButton: jest.fn(),
  };
  
  const mockGoogleAccountsOAuth2 = {
    initTokenClient: jest.fn((config) => ({
      // Simulate a sample token response for testing purposes
      // You can adjust the access_token and other properties as needed for your tests
      access_token: 'sample-access-token',
      expires_in: 3600, // token expiry time in seconds
      scope: SCOPES, // Use the provided scope parameter from the config
      token_type: 'Bearer',
    })),
  };
  
  window.google = {
    accounts: {
      id: mockGoogleAccountsId,
      oauth2: mockGoogleAccountsOAuth2,
    },
  };
  
  