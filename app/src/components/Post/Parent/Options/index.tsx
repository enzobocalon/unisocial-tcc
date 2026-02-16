import { useNavigation } from '@react-navigation/native';
import { forwardRef } from 'react';
import { Post } from '../../../../__generated__/graphql';
import { useAuth } from '../../../../context/AuthContext';
import { StackProps } from '../../../../types/Navigation';
import { BottomSheetButton } from '../../../BottomSheet/BottomSheetButton';
import { Edit } from '../../../Icons/Edit';
import { Trash } from '../../../Icons/Trash';
import { Text } from '../../../Text';
import { BottomSheet } from '../../../BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useOptions } from './useOptions';
import { Loading } from '../../../Loading';
import { View } from 'moti';
import { Cross } from '../../../Icons/Cross';

interface PostOptionsProps {
  post: Post;
}

export const PostOptions = forwardRef<BottomSheetModal, PostOptionsProps>(
  ({ post }, ref) => {
    const { user } = useAuth();
    const navigation = useNavigation<StackProps>();
    const { handleAlert, isPending, theme } = useOptions(post, ref);

    return (
      <View>
        <BottomSheet
          ref={ref}
          snapPoints={['25%']}
          useBackdrop
          enableDynamicSizing
        >
          <View>
            {user?.me.id === post.user.id && (
              <BottomSheetButton
                onPress={() => {
                  // @ts-expect-error - dismiss is not in the types
                  ref?.current?.dismiss();
                  navigation.navigate('Publish', {
                    isSharing: false,
                    post: post,
                  });
                }}
              >
                <Edit />
                <Text>Editar</Text>
              </BottomSheetButton>
            )}
            {user?.me.id === post.user.id && (
              <BottomSheetButton onPress={handleAlert} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loading color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>
                      Carregando...
                    </Text>
                  </>
                ) : (
                  <>
                    <Trash color={theme.colors.error.primary} />
                    <Text color={theme.colors.error.primary}>Apagar</Text>
                  </>
                )}
              </BottomSheetButton>
            )}
            {/* {user?.me.id !== post.user.id && (
            <BottomSheetButton onPress={() => { }}>
              <Text>Denunciar</Text>
            </BottomSheetButton>
          )} */}
            <BottomSheetButton
              onPress={() => {
                ref?.current?.dismiss();
              }}
            >
              <Cross />
              <Text>Fechar</Text>
            </BottomSheetButton>
          </View>
        </BottomSheet>
      </View>
    );
  }
);

PostOptions.displayName = 'PostOptions';
