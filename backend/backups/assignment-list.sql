WITH task_data AS (
    SELECT 
        a.id AS assignment_id,
        a.name AS assignment_name,
        a.icon AS assignment_icon,
        t.id AS task_id,
        t.name AS task_name,
        t.due_date AS due_date,
        NOT atu.completed AS is_pending
    FROM assignments a
    JOIN assignments_users au ON a.id = au.assignment_id
    JOIN assignments_tasks t ON a.id = t.assignment_id
    LEFT JOIN assignments_tasks_users atu ON t.id = atu.task_id AND atu.user_id = au.id
    WHERE au.user_id = '82d4bd13-293e-445d-b280-a66c4384b391' AND atu.user_id = au.id
),
grouped_task_counts AS (
    SELECT 
        assignment_id,
        assignment_name,
        assignment_icon,
        due_date,
        COUNT(task_id) FILTER (WHERE is_pending) AS pending_count
    FROM task_data
    WHERE due_date IS NOT NULL AND is_pending
    GROUP BY assignment_id, assignment_name, assignment_icon, due_date
),
grouped_tasks AS (
    SELECT 
        due_date::date AS "dueDate",
        false AS is_completed, -- Marca como não concluído
        json_agg(
            json_build_object(
                'id', assignment_id,
                'name', assignment_name,
                'icon', assignment_icon,
                'dueDate', due_date,
                'isPending', true,
                'pendingCount', pending_count
            ) ORDER BY due_date
        ) AS item
    FROM grouped_task_counts
    GROUP BY due_date
    ORDER BY due_date ASC
),
completed_assignments AS (
    SELECT 
        '1970-01-01'::date AS "dueDate",
        true AS is_completed, -- Marca como concluído
        json_agg(
            json_build_object(
                'id', a.id,
                'name', a.name,
                'icon', a.icon,
                'dueDate', '1970-01-01',
                'isPending', false,
                'pendingCount', 0 -- Sempre 0 para completas
            )
        ) AS item
    FROM assignments a
    JOIN assignments_users au ON a.id = au.assignment_id
    WHERE au.user_id = '82d4bd13-293e-445d-b280-a66c4384b391'
      AND NOT EXISTS (
          SELECT 1
          FROM assignments_tasks t
          LEFT JOIN assignments_tasks_users atu 
          ON t.id = atu.task_id AND atu.user_id = au.id
          WHERE t.assignment_id = a.id 
            AND NOT atu.completed
      )
    GROUP BY 1970-01-01
)
SELECT *
FROM grouped_tasks
UNION ALL
SELECT *
FROM completed_assignments
ORDER BY is_completed ASC, -- Prioriza pendentes antes das completas
         "dueDate" ASC
LIMIT 10
OFFSET 0;
