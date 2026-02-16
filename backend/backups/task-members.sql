SELECT 
	atu.id AS id,  
	atu.task_id AS "taskId",  
	atu.user_id AS "userId",
	atu.completed AS completed,
	(SELECT COUNT(*) 
     FROM assignments_tasks_users 
     WHERE task_id = atu.task_id AND completed = true) AS "completedCount",

    (SELECT COUNT(*) 
     FROM assignments_tasks_users 
     WHERE task_id = atu.task_id) AS "totalCount"
	
 FROM assignments_tasks_users atu 
	JOIN assignments_users au ON atu.user_id = au.id
	JOIN users u on AU.user_id = u.id
	WHERE atu.task_id = '0c5dead9-34a4-4096-806e-c68d08bf20c1' 
