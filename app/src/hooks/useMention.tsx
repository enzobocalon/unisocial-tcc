import { Text } from '../components/Text';
import { useTheme } from 'styled-components';

export function useMention() {
  const theme = useTheme();
  const replaceMetaTag = (
    content: string,
    onPress: (userId: string) => void,
    disablePressing: boolean = false
  ) => {
    if (!content) return content;
    const regex = /<mention id=(.*?) username=(.*?) name=(.*?) \/>/g;
    const text = content;
    const elements = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [fullMatch, id, username, name] = match;
      const index = match.index;
      elements.push(text.substring(lastIndex, index));
      const element = (
        <Text key={id} onPress={() => onPress(id)} disabled={disablePressing}>
          <Text
            color={
              !disablePressing ? theme.colors.blue : theme.colors.lightGray
            }
            weight={disablePressing ? 'Regular' : 'Semibold'}
          >
            {name}
          </Text>
        </Text>
      );
      elements.push(element);
      lastIndex = index + fullMatch.length;
    }
    elements.push(text.substring(lastIndex));
    return elements;
  };

  const formatFromMetaTagToPublish = (content: string) => {
    const regex =
      /<mention id=([a-zA-Z0-9-]+) username=([a-zA-Z0-9-]+) name=[^>]+>/g;
    const matches = content.matchAll(regex);

    let replacedContent = content;
    for (const match of matches) {
      const username = match[2];
      const id = match[1];
      replacedContent = replacedContent.replace(
        match[0],
        `@[${username}](${id})`
      );
    }
    return {
      content: replacedContent,
    };
  };

  const formatFromMentionToRequest = (content: string) => {
    const regex =
      /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/gi;
    const matches = content.matchAll(regex);
    let replacedContent = content;
    for (const match of matches) {
      const id = match[5];
      replacedContent = replacedContent.replace(match[0], `@${id}`);
    }
    return replacedContent;
  };

  return {
    replaceMetaTag,
    formatFromMetaTagToPublish,
    formatFromMentionToRequest,
  };
}
