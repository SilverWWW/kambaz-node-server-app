import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const createUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ message: "Only faculty can create users" });
      return;
    }
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ message: "Only faculty can delete users" });
      return;
    }
    const { userId } = req.params;
    dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  };

  const findUsersEnrolledInCourse = (req, res) => {
    const { courseId } = req.params;
    const users = dao.findUsersEnrolledInCourse(courseId);
    res.json(users);
  };

  const updateUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    const userId = req.params.userId;
    const userUpdates = req.body;
    
    if (!currentUser || (currentUser._id !== userId && currentUser.role !== "FACULTY")) {
      res.status(403).json({ message: "Unauthorized to update this user" });
      return;
    }
    
    const updatedUser = dao.updateUser(userId, userUpdates);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    if (currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    
    res.json(updatedUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.get("/api/courses/:courseId/users", findUsersEnrolledInCourse);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}

