WITH total_users AS (
    SELECT chat_id, COUNT(*) AS user_count
    FROM chat_users
    GROUP BY chat_id
),
message_read_status AS (
    SELECT
        ms.message_id,
        COUNT(*) AS read_count
    FROM message_status ms
    WHERE ms.status = 'READ'
    GROUP BY ms.message_id
)
SELECT
    m.id,
    m.user_id,
    NULL AS action,
    m.content AS message_content,
    false AS system,
    m.created_at,
    u.id AS user_id,
    u.name AS user_name,
    u.avatar AS user_avatar,
    u.username AS user_username,
    NULL AS action_author_name,
    NULL AS action_author_avatar,
    NULL AS action_author_username,
    CASE
        WHEN COALESCE(mr.read_count, 0) = tu.user_count THEN 'READ'
        ELSE 'UNREAD'
    END AS message_status,
    ARRAY_AGG(ma.url) AS media_urls
FROM messages m
JOIN users u ON u.id = m.user_id
LEFT JOIN medias ma ON ma.message_id = m.id
LEFT JOIN total_users tu ON tu.chat_id = m.chat_id
LEFT JOIN message_read_status mr ON mr.message_id = m.id
WHERE m.chat_id = 'cbaea75d-6705-4010-b0c5-b54db87b2aaa'
GROUP BY 
    m.id, m.user_id, m.content, m.created_at, u.id, u.name, u.avatar, u.username, tu.user_count, mr.read_count

UNION ALL

SELECT
    ca.id,
    ca.user_id,
    ca.action::text AS action,
    ca.message AS message_content,
    true AS system,
    ca.created_at,
    u.id AS user_id,
    u.name AS user_name,
    u.avatar AS user_avatar,
    u.username AS user_username,
    a.name AS action_author_name,
    a.avatar AS action_author_avatar,
    a.username AS action_author_username,
    NULL AS media_urls,
    NULL AS message_status
FROM chat_actions ca
JOIN users u ON u.id = ca.user_id
JOIN users a ON a.id = ca.action_author_id
WHERE ca.chat_id = 'cbaea75d-6705-4010-b0c5-b54db87b2aaa'

ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
