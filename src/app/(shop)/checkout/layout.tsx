import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({ children }: { children: React.ReactNode; }) {

    const session = await auth()

    if (!session?.user) {
        //learn more in: https://www.w3schools.com/tags/ref_urlencode.asp
        redirect('/auth/login?redirectTo=/checkout/address')
    }
    return (
        <>
            {children}
        </>
    );
}