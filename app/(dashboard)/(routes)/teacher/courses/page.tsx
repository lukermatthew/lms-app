import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const CoursePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="container mx-auto">
        <DataTable columns={columns} data={courses} />
      </div>
    </>
  );
};

export default CoursePage;
