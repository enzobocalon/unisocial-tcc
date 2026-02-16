WITH PaginatedUsers AS (
    SELECT DISTINCT au.id AS assignment_user_id, u.id AS user_id, u.name, u.username, u.avatar
    FROM users u
    JOIN assignments_users au ON u.id = au.user_id
    JOIN assignments_tasks_files tf ON au.id = tf.user_id
    WHERE tf.task_id = '0c5dead9-34a4-4096-806e-c68d08bf20c1'
    ORDER BY u.id
    LIMIT 10 OFFSET 0  -- Substitua pelo offset real
)
SELECT 
    json_build_object(
        'id', u.assignment_user_id,
        'user', json_build_object(
            'id', u.user_id,
            'name', u.name,
            'username', u.username,
            'avatar', u.avatar
        )
    ) AS user,
    COALESCE(files.files, '[]'::json) AS files
FROM PaginatedUsers u
LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
        'id', f.id,
        'file_name', f.filename,
        'file_url', f.url
    )) AS files
    FROM assignments_tasks_files f
    JOIN assignments_users au ON f.user_id = au.id
    WHERE f.task_id = '0c5dead9-34a4-4096-806e-c68d08bf20c1' 
    AND au.user_id = u.user_id
) files ON TRUE;
