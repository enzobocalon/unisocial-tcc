import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Text } from '../Text';
import { StackProps } from '../../types/Navigation';

interface MentionTextProps {
  content: string;
  disablePressing?: boolean;
}

export function MentionText({
  content,
  disablePressing = false,
}: MentionTextProps) {
  const theme = useTheme();
  const navigation = useNavigation<StackProps>();

  if (!content) return null;

  const regex = /<mention id=(.*?) username=(.*?) name=(.*?) \/>/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, id, username, name] = match;
    const index = match.index;
    elements.push(content.substring(lastIndex, index));

    elements.push(
      <Text
        key={id}
        onPress={() => {
          if (!disablePressing) {
            navigation.navigate('UserProfile', { userId: id });
          }
        }}
        disabled={disablePressing}
      >
        <Text
          color={!disablePressing ? theme.colors.blue : theme.colors.lightGray}
          weight={disablePressing ? 'Regular' : 'Semibold'}
        >
          {name}
        </Text>
      </Text>
    );

    lastIndex = index + fullMatch.length;
  }

  elements.push(content.substring(lastIndex));

  return <>{elements}</>;
}
