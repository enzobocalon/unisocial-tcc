WITH task_data AS (
    SELECT 
        t.id AS task_id,
        t.name AS task_name,
        t.due_date AS due_date,
		t.description AS description,
        NOT atu.completed AS is_pending
    FROM assignments a
    JOIN assignments_users au ON a.id = au.assignment_id
    JOIN assignments_tasks t ON a.id = t.assignment_id
    LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
    WHERE au.user_id = '82d4bd13-293e-445d-b280-a66c4384b391' AND atu.user_id = au.id
),
grouped_pending_tasks AS (
    SELECT 
        due_date::date AS "dueDate",
        false AS is_completed, -- Marca como pendente
        json_agg(
            json_build_object(
                'id', task_id,
                'name', task_name,
                'dueDate', due_date,
                'isPending', is_pending,
				'description', description
            ) ORDER BY due_date
        ) AS item
    FROM task_data
    WHERE due_date IS NOT NULL AND is_pending
    GROUP BY due_date
    ORDER BY due_date ASC
),
completed_tasks AS (
    SELECT 
        '1970-01-01'::date AS "dueDate",
        true AS is_completed, -- Marca como concluído
        json_agg(
            json_build_object(
                'id', t.id,
                'name', t.name,
                'dueDate', t.due_date,
                'isPending', false,
				'description', t.description
            ) ORDER BY t.due_date
        ) AS item
    FROM assignments a
    JOIN assignments_users au ON a.id = au.assignment_id
    JOIN assignments_tasks t ON a.id = t.assignment_id
    LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
    WHERE a.id = 'a7ea16af-92c4-4d76-945c-5b28d0201418' 
      AND au.user_id = '82d4bd13-293e-445d-b280-a66c4384b391'
      AND atu.completed = true
)
SELECT *
FROM grouped_pending_tasks
UNION ALL
SELECT *
FROM completed_tasks
WHERE item IS NOT NULL
ORDER BY is_completed ASC, -- Ordena pendentes antes das concluídas
         "dueDate" ASC
LIMIT 10
OFFSET 0;
