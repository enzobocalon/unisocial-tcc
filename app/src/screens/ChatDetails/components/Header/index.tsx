import { TextInput, TouchableOpacity, View } from 'react-native';
import { Edit } from '../../../../components/Icons/Edit';
import { LeftArrow } from '../../../../components/Icons/LeftArrow';
import { UserPlus } from '../../../../components/Icons/UserPlus';
import * as S from '../../styles';
import { Avatar } from '../../../../components/Avatar';
import { Text } from '../../../../components/Text';
import { Image } from '../../../../components/Icons/Image';
import { useChatDetailsHeader } from './useChatDetailsHeader';
import { GetChatByIdQuery } from '../../../../__generated__/graphql';
import { Loading } from '../../../../components/Loading';

interface Props {
  chat: GetChatByIdQuery['getChatById'];
}

export function ChatDetailsHeader({ chat }: Props) {
  const {
    handleEditTitle,
    handleGallery,
    handleNameChange,
    icon,
    isEditingTitle,
    name,
    navigation,
    saveChanges,
    theme,
    type,
    setType,
    user,
    isPending,
  } = useChatDetailsHeader(chat);

  return (
    <>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{ padding: 16 }}
          activeOpacity={0.7}
          onPress={isEditingTitle ? handleEditTitle : navigation.goBack}
        >
          <LeftArrow />
        </TouchableOpacity>

        {(icon || isEditingTitle || type !== chat?.type) && (
          <TouchableOpacity
            style={{ padding: 16 }}
            activeOpacity={0.7}
            onPress={saveChanges}
            disabled={isPending}
          >
            {isPending ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Loading color={theme.colors.blue} />
                <Text color={theme.colors.blue}>Carregando</Text>
              </View>
            ) : (
              <Text color={theme.colors.blue}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <S.Wrapper>
        <Avatar
          size={96}
          source={icon ? icon.uri : chat?.icon}
          shouldCreatePath={!icon}
          useGroupPlaceholder={!chat?.isDirect}
        />
        <S.TitleContainer>
          {isEditingTitle ? (
            <View style={{ width: '50%', position: 'relative' }}>
              <TextInput
                style={{
                  width: '100%',
                  fontSize: 24,
                  textAlign: 'center',
                  fontFamily: 'GeneralSans-Regular',
                  color: 'black',
                }}
                value={name}
                onChangeText={handleNameChange}
              />
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: theme.colors.blue,
                  marginBottom: 4,
                }}
              />
            </View>
          ) : (
            <Text size={24} style={{ marginHorizontal: 16 }}>
              {name}
            </Text>
          )}
          {!chat?.isDirect && chat?.isAdmin && !isEditingTitle && (
            <S.EditContainer activeOpacity={0.7} onPress={handleEditTitle}>
              <Edit color={theme.colors.blue} size={18} />
            </S.EditContainer>
          )}
        </S.TitleContainer>

        {!chat?.isDirect &&
          (chat?.isAdmin || chat?.ownerId === user?.me.id) && (
            <S.QuickActions>
              <S.QuickAction activeOpacity={0.7} onPress={handleGallery}>
                <Image size={18} color={theme.colors.blue} />
                <Text>Alterar</Text>
              </S.QuickAction>
              <S.QuickAction
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('AddUsers', {
                    chatId: chat.id,
                  })
                }
              >
                <UserPlus size={18} color={theme.colors.blue} />
                <Text>Adicionar</Text>
              </S.QuickAction>
              {/* <S.QuickAction
                activeOpacity={0.7}
                onPress={() =>
                  setType((prev) => (prev === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'))
                }
              >
                <Swap size={18} color={theme.colors.blue} />
                <Text>Tornar {type === 'PRIVATE' ? 'Público' : 'Privado'}</Text>
              </S.QuickAction> */}
            </S.QuickActions>
          )}
      </S.Wrapper>

      {!chat?.isDirect && (
        <Text size={18} weight="Semibold" style={{ paddingHorizontal: 16 }}>
          Membros
        </Text>
      )}
    </>
  );
}
