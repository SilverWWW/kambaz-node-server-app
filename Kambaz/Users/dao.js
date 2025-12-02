import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  const createUser = (user) => {
    const userWithoutId = { ...user };
    delete userWithoutId._id;
    const newUser = { ...userWithoutId, _id: uuidv4() };
    return model.create(newUser);
  };

  const findAllUsers = async () => await model.find();

  const findUserById = async (userId) => await model.findById(userId);

  const findUserByUsername = async (username) => await model.findOne({ username: username });

  const findUserByCredentials = async (username, password) => await model.findOne({ username, password });

  const findUsersByRole = async (role) => await model.find({ role: role });

  const findUsersByPartialName = async (partialName) => {
    const regex = new RegExp(partialName, "i");
    return await model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  const updateUser = async (userId, user) => await model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = async (userId) => await model.findByIdAndDelete(userId);

  const findUsersEnrolledInCourse = async (courseId) => {
    const { enrollments } = db;
    const enrolledUserIds = enrollments
      .filter((enrollment) => enrollment.course === courseId)
      .map((enrollment) => enrollment.user);
    const users = await model.find({ _id: { $in: enrolledUserIds } });
    return users;
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
    findUsersEnrolledInCourse,
  };
}

