import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  const createModule = (module) => {
    const moduleWithoutId = { ...module };
    delete moduleWithoutId._id;
    const newModule = { ...moduleWithoutId, _id: uuidv4() };
    return model.create(newModule);
  };

  const findModulesForCourse = async (courseId) => {
    return await model.find({ course: courseId });
  };

  const deleteModule = async (moduleId) => {
    await model.findByIdAndDelete(moduleId);
  };

  const updateModule = async (moduleId, moduleUpdates) => {
    await model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
    return await model.findById(moduleId);
  };

  return {
    createModule,
    findModulesForCourse,
    deleteModule,
    updateModule,
  };
}

