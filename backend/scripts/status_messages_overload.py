import psycopg2
from psycopg2.extras import execute_batch
import uuid
import datetime

# IDs dos usuários fornecidos
user_ids = [
    'a8440ca5-3317-409a-b471-a06844af2495',
    'b4f60f39-6808-45f8-8564-905e0c1ed0a2',
    '3ba2aa5d-38e6-42f4-88d5-d0238d59aeac',
    'd9340360-58f0-420b-99e5-976f23cd3faa',
    '82d4bd13-293e-445d-b280-a66c4384b391',
    '5dbd3e84-6fe7-4412-a77b-b4942307a6a8'
]

# Configurações do banco de dados
conn = psycopg2.connect(
    database="eng_comp_tcc",
    host="localhost",
    user="postgres",
    password="admin",
    port="5432"
)
cursor = conn.cursor()

# Função para gerar 1.000.000 mensagens
def create_messages():
    messages = []
    message_statuses = []

    for i in range(1000000):
        user_id = user_ids[i % len(user_ids)]
        message_content = f"Mensagem número {i + 1}"
        message_id = str(uuid.uuid4())
        updated_at = str(datetime.date.today())

        # Inserir a mensagem na tabela "messages" (agora incluindo 'updated_at')
        messages.append((
            message_id, user_id, message_content, updated_at 
        ))

        # Criar os MessageStatus para cada usuário
        for status_user_id in user_ids:
            message_statuses.append((
                str(uuid.uuid4()),
                message_id, status_user_id, 'UNREAD', str(datetime.date.today())
            ))

    # Inserir as mensagens na tabela "messages"
    insert_messages_query = """
        INSERT INTO messages (id, user_id, content, updated_at)
        VALUES (%s, %s, %s, %s)
    """
    execute_batch(cursor, insert_messages_query, messages)

    # Inserir os MessageStatus na tabela "message_status" com updated_at
    insert_status_query = """
        INSERT INTO message_status (id, message_id, user_id, status, updated_at)
        VALUES (%s, %s, %s, %s, %s)
    """
    execute_batch(cursor, insert_status_query, message_statuses)

    # Commit para garantir que as mudanças sejam salvas no banco
    conn.commit()

    print("Mensagens e status criados com sucesso!")


# Chamar a função para criar as mensagens
create_messages()

# Fechar o cursor e a conexão
cursor.close()
conn.close()
