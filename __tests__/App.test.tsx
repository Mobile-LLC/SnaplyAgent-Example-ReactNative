/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// No native side under Jest.
jest.mock('@snaplyagent/react-native', () => {
  const { View } = require('react-native');
  return {
    Snaply: {
      on: jest.fn(),
      configure: jest.fn(async () => {}),
      identify: jest.fn(),
      reset: jest.fn(),
      supportCode: jest.fn(async () => null),
      showSupportCode: jest.fn(),
    },
    SnaplyRedact: View,
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
