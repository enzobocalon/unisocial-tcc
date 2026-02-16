import * as S from './styles';
import { LeftArrow } from '../../components/Icons/LeftArrow';
import { Text } from '../../components/Text';
import { Avatar } from '../../components/Avatar';
import { Image as ImageIcon } from '../../components/Icons/Image';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { usePublish } from './usePublish';
import { MediaGrid } from '../../components/Medias/MediaGrid';
import { Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import { MentionInput } from 'react-native-controlled-mentions';
import { ParentPost } from '../../components/Post/Parent';
import { Parent } from '../../__generated__/graphql';
import { Loading } from '../../components/Loading';

type PublishProps = StackScreenProps<StackParams, 'Publish'>;

export function Publish({ route }: PublishProps) {
  const { isSharing, post } = route.params;
  const {
    devicePhotos,
    user,
    navigation,
    handleGallery,
    selectedImages,
    handleDeviceMediaSelection,
    onSourceChange,
    control,
    textInputRef,
    handleSubmit,
    renderSuggestions,
    theme,
    canPublicate,
    isPending,
  } = usePublish({ isSharing, post });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <S.Container>
        <S.Header>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LeftArrow size={20} />
          </TouchableOpacity>
          <S.Publish
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={!canPublicate || isPending}
            canPublicate={canPublicate}
          >
            {isPending ? (
              <Loading />
            ) : (
              <Text color="white" weight="Semibold">
                Publicar
              </Text>
            )}
          </S.Publish>
        </S.Header>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <S.Content>
            <S.InputContainer>
              <Avatar size={32} source={user?.me.avatar} />
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange } }) => (
                  <MentionInput
                    containerStyle={{
                      flex: 1,
                    }}
                    inputRef={textInputRef}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      color: '#333',
                      minHeight: 80,
                      textAlignVertical: 'top',
                      flex: 1,
                    }}
                    placeholder="O que você está pensando?"
                    placeholderTextColor="#999"
                    multiline
                    selectionColor={theme.colors.blue}
                    value={value as string}
                    onChange={onChange}
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
            </S.InputContainer>

            {isSharing && post?.id && (
              <ParentPost post={post as Parent} disablePress />
            )}

            {selectedImages && selectedImages.length > 0 && (
              <S.MediaGridContainer>
                <MediaGrid
                  sources={selectedImages}
                  disablePressable
                  handleSourceChange={onSourceChange}
                  shouldCreatePath={false}
                  useScrollView
                />
              </S.MediaGridContainer>
            )}
          </S.Content>
        </ScrollView>

        {!selectedImages?.length && (
          <S.DeviceMediaGrid>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                padding: 4,
                gap: 8,
              }}
            >
              {devicePhotos.map((item) => (
                <TouchableOpacity
                  key={item.node.id}
                  activeOpacity={0.8}
                  onPress={() => handleDeviceMediaSelection(item)}
                >
                  {item.node.id === 'APP_ADD' ? (
                    <S.AddMediaItem>
                      <ImageIcon />
                      <Text size={14}>Adicionar</Text>
                    </S.AddMediaItem>
                  ) : (
                    <S.DeviceMedia
                      source={{
                        uri: item.node.image.uri,
                      }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </S.DeviceMediaGrid>
        )}

        <S.Footer>
          <TouchableOpacity activeOpacity={0.8} onPress={handleGallery}>
            <ImageIcon size={20} />
          </TouchableOpacity>
        </S.Footer>
      </S.Container>
    </KeyboardAvoidingView>
  );
}
