export default `{
  "dependencies": {
    "@connery-io/sdk": "^0.0.13"
  },
  "devDependencies": {
    "connery": "^0.0.36",
    "@types/jest": "^29.5.6",
    "jest": "^29.6.1",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  },
  "scripts": {
    "test": "jest --passWithNoTests",
    "build": "npm run test && webpack && connery dev validate"
  }
}
`;
