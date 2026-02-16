import { TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../../components/Text';
import * as S from './styles';
import { LeftArrow } from '../../../../components/Icons/LeftArrow';
import { Avatar } from '../../../../components/Avatar';
import { useAssignmentDetailsHeader } from './useAssignmentDetailsHeader';
import { UserPlus } from '../../../../components/Icons/UserPlus';
import { Image } from '../../../../components/Icons/Image';
import { Chat } from '../../../../components/Icons/Chat';
import { Edit } from '../../../../components/Icons/Edit';
import { Assignment } from '../../../../__generated__/graphql';
import { Loading } from '../../../../components/Loading';

interface Props {
  assignment: Assignment;
}

export function AssignmentDetailsHeader({ assignment }: Props) {
  const {
    navigation,
    theme,
    handleEditTitle,
    isEditingTitle,
    handleGallery,
    icon,
    name,
    saveChanges,
    handleNameChange,
    handleCanNavigate,
    isPendingNavigate,
    isPending,
  } = useAssignmentDetailsHeader(assignment);
  return (
    <S.Container>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{ padding: 16 }}
          activeOpacity={0.7}
          onPress={navigation.goBack}
        >
          <LeftArrow />
        </TouchableOpacity>
        {(isEditingTitle || icon) && (
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
                <Text color={theme.colors.blue}>Carregando...</Text>
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
          useGroupPlaceholder
          shouldCreatePath={!icon}
          source={icon ? icon.uri : assignment.icon}
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
              {assignment.name}
            </Text>
          )}
          {!isEditingTitle && assignment.isAdmin && (
            <S.EditContainer activeOpacity={0.7} onPress={handleEditTitle}>
              <Edit color={theme.colors.blue} size={18} />
            </S.EditContainer>
          )}
        </S.TitleContainer>

        <S.QuickActions>
          {assignment.isAdmin && (
            <>
              <S.QuickAction activeOpacity={0.7} onPress={handleGallery}>
                <Image size={18} color={theme.colors.blue} />
                <Text>Alterar</Text>
              </S.QuickAction>
              <S.QuickAction
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('AddUsers', {
                    assignmentId: assignment.id,
                  })
                }
              >
                <UserPlus size={18} color={theme.colors.blue} />
                <Text>Adicionar</Text>
              </S.QuickAction>
            </>
          )}
          {assignment.chatId && (
            <S.QuickAction
              activeOpacity={0.7}
              onPress={handleCanNavigate}
              disabled={isPendingNavigate}
            >
              {isPendingNavigate ? (
                <Loading color={theme.colors.blue} />
              ) : (
                <Chat size={18} color={theme.colors.blue} />
              )}
              <Text>{isPendingNavigate ? 'Carregando...' : 'Ver Chat'}</Text>
            </S.QuickAction>
          )}
        </S.QuickActions>
      </S.Wrapper>

      <Text size={18} weight="Semibold" style={{ paddingHorizontal: 16 }}>
        Membros
      </Text>
    </S.Container>
  );
}
