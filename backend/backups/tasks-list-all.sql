WITH task_data AS (
    SELECT 
        t.id AS task_id,
        t.name AS task_name,
		t.description AS description,
        t.due_date AS due_date,
        NOT atu.completed AS is_pending
    FROM assignments a
    JOIN assignments_users au ON a.id = au.assignment_id
    JOIN assignments_tasks t ON a.id = t.assignment_id
    LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id
    WHERE a.id = 'a7ea16af-92c4-4d76-945c-5b28d0201418' AND atu.user_id = au.id
),
grouped_pending_tasks AS (
    SELECT 
        due_date::date AS "dueDate",
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
    GROUP BY due_date
    ORDER BY due_date ASC
)
SELECT *
FROM grouped_pending_tasks
WHERE item IS NOT NULL
ORDER BY "dueDate" ASC
LIMIT 10
OFFSET 0;
