import { forwardRef } from 'react';
import { BottomSheet } from '../../../../components/BottomSheet';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../../components/Text';
import { Button } from '../../../../components/Button';
import { useTheme } from 'styled-components';

interface TermsProps {
  onAccept?: () => void;
  onClose?: () => void;
}

type Section = {
  id: string;
  title: string;
  content: string[];
};

const SECTIONS: Section[] = [
  {
    id: 'intro',
    title: 'Bem-vindo(a)!',
    content: [
      'Estes Termos de Serviço regem o uso do aplicativo Unisocial. Ao continuar, você declara ter lido e concordado com os Termos abaixo.',
      'Data de última atualização: 14/11/2025.',
    ],
  },
  {
    id: 'account',
    title: '1. Conta e Cadastro',
    content: [
      'Para utilizar os recursos, é necessário criar uma conta com informações verdadeiras e atualizadas.',
      'Você é responsável por manter a confidencialidade de suas credenciais e por toda atividade realizada na sua conta.',
      'Contas podem ser suspensas em caso de fraude, violação destes Termos, ou uso indevido.',
    ],
  },
  {
    id: 'privacy',
    title: '2. Privacidade e Dados',
    content: [
      'Coletamos dados para funcionamento do app (ex.: nome, e-mail institucional, curso, RA) conforme nossa Política de Privacidade.',
      'Você consente com o tratamento de dados necessários para recursos como chat, tarefas, notificações e geolocalização (quando habilitado).',
      'O compartilhamento de informações segue princípios de necessidade, segurança e transparência.',
    ],
  },
  {
    id: 'lgpd',
    title: '3. LGPD e Consentimento',
    content: [
      'Estamos em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
      'Ao prosseguir, você CONSENTE expressamente com o tratamento dos seus dados pessoais para finalidades acadêmicas e operacionais da plataforma.',
      'Finalidades incluem cadastro, autenticação, comunicação institucional, gerenciamento de tarefas, participação em chats, e melhoria da experiência de uso.',
      'O consentimento pode ser revogado a qualquer momento, observadas as obrigações legais e acadêmicas aplicáveis.',
    ],
  },
  {
    id: 'content',
    title: '4. Conteúdo e Conduta',
    content: [
      'É proibido publicar conteúdo ilegal, ofensivo, difamatório, discriminatório ou que viole direitos autorais.',
      'Respeite as regras das atividades e tarefas, bem como a comunidade acadêmica.',
      'Podemos remover conteúdos que violem estes Termos e aplicar medidas cabíveis.',
    ],
  },
  {
    id: 'features',
    title: '5. Funcionalidades (Chats, Tarefas, Arquivos, Geolocalização)',
    content: [
      'Chats e grupos devem ser usados para fins acadêmicos e colaboração saudável.',
      'Tarefas podem exigir envio de arquivos; você declara ter direitos sobre o material enviado.',
      'O recurso de geolocalização, quando disponível e habilitado por você, utiliza localização para melhorar a experiência no campus.',
      'Você concorda em fornecer sua localização apenas quando necessário e em conformidade com as leis aplicáveis.',
    ],
  },
  {
    id: 'liability',
    title: '6. Limitação de Responsabilidade',
    content: [
      'O app é fornecido “como está”. Não garantimos disponibilidade ininterrupta ou ausência de erros.',
      'Não nos responsabilizamos por perdas indiretas decorrentes do uso, falhas de rede ou terceiros.',
    ],
  },
  {
    id: 'termination',
    title: '7. Encerramento e Alterações',
    content: [
      'Podemos modificar funcionalidades e estes Termos para aprimorar o serviço. Manteremos comunicação razoável sobre mudanças relevantes.',
      'Você pode encerrar seu uso a qualquer momento. O uso contínuo após alterações implica concordância.',
    ],
  },
  {
    id: 'contact',
    title: '8. Contato',
    content: [
      'Dúvidas ou solicitações sobre estes Termos podem ser encaminhadas aos canais oficiais da instituição.',
    ],
  },
];

export const Terms = forwardRef<BottomSheetModal, TermsProps>(
  ({ onAccept, onClose }, ref) => {
    const theme = useTheme();

    return (
      <BottomSheet ref={ref} snapPoints={['80%']} useScrollableComponent>
        <BottomSheetFlatList
          data={SECTIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, padding: 16 }}
          ListHeaderComponent={() => (
            <View style={{ gap: 8 }}>
              <Text size={22} weight="Bold">
                Termos de Serviço
              </Text>
              <Text size={14} color={theme.colors.lightGray}>
                Leia com atenção antes de continuar.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ gap: 6 }}>
              <Text size={18} weight="Semibold">
                {item.title}
              </Text>
              {item.content.map((paragraph, idx) => (
                <Text key={`${item.id}-${idx}`} size={16}>
                  {paragraph}
                </Text>
              ))}
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{ gap: 8, marginTop: 8 }}>
              <Button onPress={onAccept}>
                <Text weight="Semibold" color="white">
                  Aceito os Termos e consinto com a LGPD
                </Text>
              </Button>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={8}
                onPress={onClose}
                style={{ alignSelf: 'center' }}
              >
                <Text weight="Semibold" color={theme.colors.blue}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </BottomSheet>
    );
  }
);

Terms.displayName = 'Terms';
