-- Índices para a tabela chat_users
CREATE INDEX idx_chat_users_user_chat ON chat_users(user_id, chat_id);

-- Índices para a tabela messages
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_chat_user ON messages(chat_id, user_id);

-- Índices para a tabela message_status
CREATE INDEX idx_message_status_message_user ON message_status(message_id, user_id);
CREATE INDEX idx_message_status_message_user_status ON message_status(message_id, user_id, status);
