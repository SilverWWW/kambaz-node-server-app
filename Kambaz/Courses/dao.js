import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const findAllCourses = async () => await model.find();

  const findCoursesForEnrolledUser = async (userId) => {
    const { enrollments } = db;
    const enrolledCourseIds = enrollments
      .filter((enrollment) => enrollment.user === userId)
      .map((enrollment) => enrollment.course);
    const courses = await model.find({ _id: { $in: enrolledCourseIds } });
    return courses;
  };

  const createCourse = (course) => {
    const courseWithoutId = { ...course };
    delete courseWithoutId._id;
    const newCourse = { ...courseWithoutId, _id: uuidv4() };
    return model.create(newCourse);
  };

  const deleteCourse = async (courseId) => {
    await model.findByIdAndDelete(courseId);
    // Note: Enrollment cleanup would need to be handled separately if enrollments move to MongoDB
  };

  const updateCourse = async (courseId, courseUpdates) => {
    await model.updateOne({ _id: courseId }, { $set: courseUpdates });
    return await model.findById(courseId);
  };

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}

