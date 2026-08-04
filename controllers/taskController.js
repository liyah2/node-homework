const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const pool = require("../db/pg-pool");

async function create(req, res) {
  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const task = await pool.query(
    `INSERT INTO tasks (title, is_completed, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, title, is_completed`,
    [value.title, value.isCompleted, global.user_id]
  );

  return res.status(201).json(task.rows[0]);
}

//////Index////

async function index(req, res) {
  const tasks = await pool.query(
    "SELECT id, title, is_completed FROM tasks WHERE user_id = $1",
    [global.user_id]
  );

  if (tasks.rows.length === 0) {
    return res.sendStatus(404);
  }

  return res.status(200).json(tasks.rows);
}

//show//

async function show(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const task = await pool.query(
    `SELECT id, title, is_completed
    FROM tasks
    WHERE id = $1 AND user_id = $2`,
    [taskId, global.user_id]
  );

  if (task.rows.length === 0) {
    return res.sendStatus(404);
  }

  return res.status(200).json(task.rows[0]);
}

//update//

async function update(req, res) {
  if (!req.body) {
    req.body = {};
  }

  const { error, value: taskChange } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  let keys = Object.keys(taskChange);

  keys = keys.map((key) => (key === "isCompleted" ? "is_completed" : key));

  const setClauses = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const idParameter = `$${keys.length + 1}`;
  const userParameter = `$${keys.length + 2}`;

  const updatedTask = await pool.query(
    `UPDATE tasks
     SET ${setClauses}
     WHERE id = ${idParameter} AND user_id = ${userParameter}
     RETURNING id, title, is_completed`,
    [...Object.values(taskChange), taskId, global.user_id]
  );

  if (updatedTask.rows.length === 0) {
    return res.sendStatus(404);
  }

  return res.status(200).json(updatedTask.rows[0]);
}

//delete//

async function deleteTask(req, res) {
  const taskId = parseInt(req.params?.id);

  if (!taskId) {
    return res.status(400).json({
      message: "The task ID passed is not valid.",
    });
  }

  const deletedTask = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, is_completed`,
    [taskId, global.user_id]
  );

  if (deletedTask.rows.length === 0) {
    return res.sendStatus(404);
  }

  return res.status(200).json(deletedTask.rows[0]);
}

module.exports = {
  create,
  index,
  show,
  update,
  deleteTask,
};
