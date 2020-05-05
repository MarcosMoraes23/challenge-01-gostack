const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.get("/repositories", (request, response) => {
  if (repositories.length === 0) {
    return response.status(200).json({ data: "There are no registered repositories." });
  }
  return response.status(200).json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIdx = repositories.findIndex(repo => repo.id === id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: "Repository not found." })
  }

  const { likes } = repositories[repositoryIdx];
  const repository = { id, title, url, techs, likes };
  repositories[repositoryIdx] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIdx = repositories.findIndex(repo => repo.id === id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: "Repository not found." })
  }
  repositories.splice(repositoryIdx, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIdx = repositories.findIndex(repo => repo.id === id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: "Repository not found." })
  }
  
  repositories[repositoryIdx].likes++
  return response.status(200).json(repositories[repositoryIdx]);
});

module.exports = app;
