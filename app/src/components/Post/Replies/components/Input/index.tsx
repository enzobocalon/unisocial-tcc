/* eslint-disable @typescript-eslint/no-explicit-any */
import * as S from '../../styles';
import { Text } from '../../../../Text';
import { forwardRef } from 'react';
import { Media, Reply } from '../../../../../__generated__/graphql';
import { Control, Controller } from 'react-hook-form';
import { MentionSuggestionsProps } from 'react-native-controlled-mentions';
import { Cross } from '../../../../Icons/Cross';
import { Avatar } from '../../../../Avatar';
import { useAuth } from '../../../../../context/AuthContext';
import { useTheme } from 'styled-components';
import { MediaGrid } from '../../../../Medias/MediaGrid';
import { Image } from '../../../../Icons/Image';
import { TextInput, View } from 'react-native';
import { Loading } from '../../../../Loading';

interface ReplyInputProps {
  editing: Reply | null;
  handleEdit: (reply: Reply | null) => void;
  handleGallery: () => Promise<void>;
  onSourceChange: (source: Media) => void;
  selectedImages:
    | {
        id: string;
        url: string;
        extension?: string | undefined;
      }[]
    | undefined;
  control: Control<
    {
      content?: string | undefined;
      medias?:
        | {
            id: string;
            url: string;
            extension: string;
          }[]
        | undefined;
    },
    any,
    {
      content?: string | undefined;
      medias?:
        | {
            id: string;
            url: string;
            extension: string;
          }[]
        | undefined;
    }
  >;
  parent: Reply | null;
  handleSubmit: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  setParent: React.Dispatch<React.SetStateAction<Reply | null>>;
  renderSuggestions: React.FC<MentionSuggestionsProps>;
  borderColor?: string;
  isPending: boolean;
}

export const ReplyInput = forwardRef<TextInput, ReplyInputProps>(
  (
    {
      editing,
      parent,
      setParent,
      handleEdit,
      control,
      handleSubmit,
      handleGallery,
      onSourceChange,
      renderSuggestions,
      selectedImages,
      borderColor,
      isPending,
    },
    ref
  ) => {
    const { user } = useAuth();
    const theme = useTheme();
    return (
      <>
        {parent && (
          <S.ReplyActionContainer>
            <Text size={14}>
              Respondendo a{' '}
              <Text weight="Bold" size={14}>
                {parent.user.name}
              </Text>
            </Text>
            <S.ReplyActionTouchable
              activeOpacity={0.7}
              onPress={() => setParent(null)}
            >
              <Cross color="white" size={14} />
            </S.ReplyActionTouchable>
          </S.ReplyActionContainer>
        )}
        {editing && (
          <S.ReplyActionContainer>
            <Text size={14}>Editando resposta.</Text>
            <S.ReplyActionTouchable
              activeOpacity={0.7}
              onPress={() => handleEdit(null)}
            >
              <Cross color="white" size={14} />
            </S.ReplyActionTouchable>
          </S.ReplyActionContainer>
        )}
        <S.InputContainer borderColor={borderColor}>
          <Avatar source={user?.me.avatar} size={32} />
          <S.InputWrapper>
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <S.Input
                  placeholder="Seu comentário"
                  multiline
                  inputRef={ref}
                  value={value as string}
                  onChange={onChange}
                  style={{
                    color: '#333',
                  }}
                  placeholderTextColor={theme.colors.lightGray}
                  selectionColor={theme.colors.blue}
                  partTypes={[
                    {
                      trigger: '@',
                      renderSuggestions,
                      textStyle: {
                        fontWeight: 'bold',
                        color: theme.colors.blue,
                      },
                    },
                  ]}
                />
              )}
            />
            <S.ImageTouch
              hitSlop={4}
              activeOpacity={0.7}
              onPress={handleGallery}
            >
              <Image />
            </S.ImageTouch>
          </S.InputWrapper>
          <S.Send
            hitSlop={4}
            activeOpacity={0.7}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <View style={{ width: 48 }}>
                <Loading size={24} color={theme.colors.blue} />
              </View>
            ) : (
              <Text size={14} weight="Semibold">
                Enviar
              </Text>
            )}
          </S.Send>
        </S.InputContainer>
        {selectedImages && (
          <S.MediaGridContainer>
            <MediaGrid
              sources={selectedImages}
              disablePressable
              handleSourceChange={onSourceChange}
              shouldCreatePath={false}
            />
          </S.MediaGridContainer>
        )}
      </>
    );
  }
);

ReplyInput.displayName = 'ReplyInput';
