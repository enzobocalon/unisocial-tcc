import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as S from './styles';
import { Avatar } from '../../components/Avatar';
import ScreenHeader from '../../components/ScreenHeader';
import { Text } from '../../components/Text';
import { Camera } from '../../components/Icons/Camera';
import { Input } from '../../components/Input';
import { Picker } from '../../components/Picker/Picker';
import { useEditProfile } from './useEditProfile';
import { Controller } from 'react-hook-form';
import { Loading } from '../../components/Loading';
import { Skeleton } from '../../components/Skeleton';

export function EditProfile() {
  const {
    open,
    items,
    setOpen,
    setPickerValue,
    theme,
    user,
    pickerValue,
    pickerLoading,
    control,
    avatar,
    banner,
    handleGallery,
    handleSubmit,
    errors,
    submitLoading,
    loading,
    isLoadingBanner,
    setIsLoadingBanner,
  } = useEditProfile();

  if (loading) {
    return (
      <S.CenteredContainer>
        <Loading color={theme.colors.blue} size={32} />
      </S.CenteredContainer>
    );
  }

  return (
    <S.Container>
      <ScreenHeader
        renderBackButton
        renderMidComponent={() => <Text weight="Bold">Editar Perfil</Text>}
        renderRightComponent={() => {
          if (submitLoading) {
            return <Loading color={theme.colors.blue} size={18} />;
          }

          return (
            <TouchableOpacity onPress={handleSubmit}>
              <Text color={theme.colors.blue} weight="Semibold">
                Salvar
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <S.BannerContainer
        activeOpacity={0.8}
        onPress={() => handleGallery('BANNER')}
      >
        {isLoadingBanner && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 10000,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Skeleton />
          </View>
        )}
        <Image
          source={{
            uri: banner || 'https://picsum.photos/seed/696/3000/2000',
          }}
          style={{
            width: Dimensions.get('window').width,
            height: 100,
            objectFit: 'cover',
          }}
          onLoadEnd={() => setIsLoadingBanner(false)}
        />
        <S.CenteredPositionedAbsolute>
          <Camera size={24} color={theme.colors.lighterGray} />
        </S.CenteredPositionedAbsolute>
      </S.BannerContainer>
      <S.InfoRow>
        <S.AvatarContainer onPress={() => handleGallery('AVATAR')}>
          <Avatar
            source={avatar || user?.me.avatar}
            size={64}
            shouldCreatePath={avatar ? false : true}
          />
          <S.CenteredPositionedAbsolute
            style={{
              borderRadius: 32,
            }}
          >
            <Camera size={18} color={theme.colors.lighterGray} />
          </S.CenteredPositionedAbsolute>
        </S.AvatarContainer>
      </S.InfoRow>
      <S.Form>
        <S.FormItem>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Nome"
                animation={{
                  animationIn: 12,
                }}
                style={{
                  color: 'black',
                }}
                error={errors.name?.message}
              />
            )}
          />
        </S.FormItem>

        <S.FormItem>
          <Controller
            name={'bio'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="Bio"
                onChangeText={onChange}
                animation={{
                  animationIn: 12,
                }}
                style={{
                  color: 'black',
                }}
                textAlignVertical="top"
                multiline
                numberOfLines={6}
                error={errors.bio?.message}
              />
            )}
          />
        </S.FormItem>

        <S.FormItem>
          <Controller
            name="courseId"
            control={control}
            render={() => (
              <Picker
                open={open}
                items={items}
                setOpen={setOpen}
                value={pickerValue}
                setValue={setPickerValue}
                placeholder="Seu curso"
                dropDownDirection="BOTTOM"
                zIndex={999}
                loading={pickerLoading}
                error={errors.courseId?.message}
              />
            )}
          />
        </S.FormItem>
      </S.Form>

      {/* <TouchableOpacity
        style={{
          padding: 16,
        }}
        activeOpacity={0.8}
      >
        <Text numberOfLines={2} align="center">
          Para atualizar suas informações pessoais, navegue até{' '}
          <Text weight="Semibold" color={theme.colors.blue}>
            Minha Conta
          </Text>
        </Text>
      </TouchableOpacity> */}
    </S.Container>
  );
}
