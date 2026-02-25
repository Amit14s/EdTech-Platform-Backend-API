import mongoose from "mongoose";
import course from "../../models/coursemodel.js";

const MONGOURL='mongodb://mongo:TbqrNiQyEYKThzIoVBATKCpXYFHbpDGo@mainline.proxy.rlwy.net:51691';



async function fixCourses() {
  await mongoose.connect(MONGOURL);

  // 1️⃣ Remove broken fields completely
  await course.updateMany(
    {},
    {
      $unset: {
        createdAt: ""
      }
    }
  );

  // 2️⃣ Force Mongoose to recreate timestamps
  const courses = await course.find();
  for (const c of courses) {
    await c.save(); // timestamps regenerated correctly
  }

  console.log("✅ Courses fixed");
  process.exit(0);
}

fixCourses();
