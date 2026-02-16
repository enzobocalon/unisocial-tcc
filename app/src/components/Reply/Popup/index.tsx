import { AnimatePresence } from 'moti';
import * as S from './styles';
import { Text } from '../../Text';
import { usePopup } from './usePopup';
import { Reply } from '../../../__generated__/graphql';
import OutsidePressHandler from 'react-native-outside-press';
import { Trash } from '../../Icons/Trash';
import { Edit } from '../../Icons/Edit';
import { Report } from '../../Icons/Report';
import { Loading } from '../../Loading';

interface ReplyPopupProps {
  open: boolean;
  onClose: () => void;
  reply: Reply;
  onEdit: (reply: Reply | null) => void;
  setReplies: React.Dispatch<React.SetStateAction<number>>;
  queryKey: string;
}

export function ReplyPopup({
  open,
  onClose,
  reply,
  onEdit,
  setReplies,
  queryKey,
}: ReplyPopupProps) {
  const { user, theme, handleDelete, isPendingDelete } = usePopup(
    reply,
    setReplies,
    queryKey
  );
  return (
    <AnimatePresence>
      {open && (
        <OutsidePressHandler onOutsidePress={onClose}>
          <S.Container
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
          >
            <>
              {user?.me.id === reply.user.id && (
                <>
                  <S.Action onPress={() => onEdit(reply)}>
                    <Text
                      size={16}
                      style={{
                        color: theme.colors.error.primary,
                      }}
                      weight="Semibold"
                    >
                      Editar
                    </Text>
                    <Edit color={theme.colors.error.primary} />
                  </S.Action>
                  <S.Action onPress={handleDelete} disabled={isPendingDelete}>
                    <Text
                      size={16}
                      style={{
                        color: theme.colors.error.primary,
                      }}
                      weight="Semibold"
                    >
                      {isPendingDelete ? 'Carregando...' : 'Apagar'}
                    </Text>
                    {isPendingDelete ? (
                      <Loading color={theme.colors.error.primary} />
                    ) : (
                      <Trash color={theme.colors.error.primary} />
                    )}
                  </S.Action>
                </>
              )}
              {user?.me.id !== reply.user.id && (
                <S.Action>
                  <Text
                    size={16}
                    style={{
                      color: theme.colors.error.primary,
                    }}
                    weight="Semibold"
                  >
                    Denunciar
                  </Text>
                  <Report color={theme.colors.error.primary} />
                </S.Action>
              )}
            </>
          </S.Container>
        </OutsidePressHandler>
      )}
    </AnimatePresence>
  );
}
