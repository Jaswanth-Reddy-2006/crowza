import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

const SimpleComponent = () => (
  <View>
    <Text testID="smoke-test-text">Crowza Attendee App Smoke Test</Text>
  </View>
);

describe('smoke test', () => {
  it('should render simple component correctly', () => {
    const { getByTestId } = render(<SimpleComponent />);
    expect(getByTestId('smoke-test-text')).toBeTruthy();
  });
});
