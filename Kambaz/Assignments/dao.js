import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = async (courseId) => {
    return await model.find({ course: courseId });
  };

  const findAssignmentById = async (assignmentId) => {
    return await model.findById(assignmentId);
  };

  const createAssignment = (assignment) => {
    const assignmentWithoutId = { ...assignment };
    delete assignmentWithoutId._id;
    const newAssignment = { ...assignmentWithoutId, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const updateAssignment = async (assignmentId, assignmentUpdates) => {
    await model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
    return await model.findById(assignmentId);
  };

  const deleteAssignment = async (assignmentId) => {
    await model.findByIdAndDelete(assignmentId);
  };

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}

