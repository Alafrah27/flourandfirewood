
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminWorkSpace from "../../components/AdminWorkSpace";

export default async function DasboardLayout({ children }) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const user = await currentUser();
    const role = user?.publicMetadata?.role || user?.privateMetadata?.role;
    
    if (role !== "admin") {
        redirect("/");
    }

    return (
        <AdminWorkSpace>
            {children}
        </AdminWorkSpace>
    );
}