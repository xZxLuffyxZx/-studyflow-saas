CREATE TABLE IF NOT EXISTS tasks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  course VARCHAR(100) NOT NULL,
  notes TEXT NOT NULL,
  status ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_due_date (due_date), INDEX idx_status (status)
);
INSERT INTO tasks (title,course,notes,status,priority,due_date) VALUES
('Finish Docker assignment','DIT312','Record demo and upload GitHub repository.','in_progress','high','2026-11-05'),
('Review database normalization','Database Systems','Study 1NF, 2NF and 3NF examples.','todo','medium','2026-11-08'),
('Prepare IoT presentation','Application for IoT','Check the feature diagram and slides.','done','low',NULL);
