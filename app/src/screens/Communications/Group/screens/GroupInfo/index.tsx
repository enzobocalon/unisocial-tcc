import { FlatList, Image, StyleSheet, Switch, View } from 'react-native';
import ScreenHeader from '../../../../../components/ScreenHeader';
import { Text } from '../../../../../components/Text';
import * as S from './styles';
import groupPlaceholder from '../../../../../assets/images/team-placeholder.png';
import { Camera } from '../../../../../components/Icons/Camera';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../../../../types/Navigation';
import { Avatar } from '../../../../../components/Avatar';
import { useGroupInfo } from './useGroupInfo';
import { RightArrow } from '../../../../../components/Icons/RightArrow';
import { FloatingButton } from '../../../../../components/FloatingButton';
import { Skeleton } from '../../../../../components/Skeleton';

type Props = StackScreenProps<StackParams, 'GroupInfo'>;

export function GroupInfo({ route }: Props) {
  const {
    params: { members, isAssignment },
  } = route;
  const {
    NUM_COLUMNS,
    ITEM_WIDTH,
    name,
    setName,
    submit,
    handleGallery,
    icon,
    isPublic,
    setIsPublic,
    screenMembers,
    isPending,
    isLoadingImage,
    setIsLoadingImage,
  } = useGroupInfo(members, isAssignment);
  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        text={isAssignment ? 'Nova atividade' : 'Novo grupo'}
        renderRightComponent={() => <View></View>}
      />
      <S.Wrapper>
        <S.Row>
          <S.ImageContainer>
            {isLoadingImage && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  zIndex: 10000,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Skeleton borderRadius={999} />
              </View>
            )}
            <Image
              source={icon ? { uri: icon.uri } : groupPlaceholder}
              width={56}
              height={56}
              style={{
                borderRadius: 999,
                width: 56,
                height: 56,
                objectFit: 'cover',
              }}
              onLoadEnd={() => setIsLoadingImage(false)}
            />
            <S.Overlay onPress={handleGallery}>
              <Camera color="white" size={24} />
            </S.Overlay>
          </S.ImageContainer>
          <S.InputContainer>
            <S.Input
              placeholder={isAssignment ? 'Nome da atividade' : 'Nome do grupo'}
              value={name}
              onChangeText={setName}
              style={{ color: 'black' }}
              placeholderTextColor={'#667781'}
            />
          </S.InputContainer>
        </S.Row>
        {/* {!isAssignment && (
          <S.Row
            style={{
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                marginVertical: 12,
              }}
            >
              <Text weight="Semibold">Tornar o grupo público?</Text>
              <Text size={14}>Qualquer pessoa poderá participar.</Text>
            </View>

            <Switch value={isPublic} onValueChange={setIsPublic} />
          </S.Row>
        )} */}
      </S.Wrapper>
      <Text
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        weight="Semibold"
      >
        Membros: {screenMembers.length}
      </Text>
      <FlatList
        data={screenMembers!}
        keyExtractor={(item) => item!.id}
        renderItem={({ item }) => (
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Avatar source={item!.avatar} size={ITEM_WIDTH} />
            <Text align="center" weight="Semibold">
              {item!.name}
            </Text>
          </View>
        )}
        contentContainerStyle={{
          flex: 1,
          padding: 8,
          gap: 8,
        }}
        columnWrapperStyle={{
          gap: 8,
        }}
        numColumns={NUM_COLUMNS}
      />

      {name && members.length > 0 && (
        <FloatingButton
          icon={<RightArrow color="white" size={18} />}
          onPress={submit}
          isLoading={isPending}
        />
      )}
    </S.Container>
  );
}
