import { Poppins as poppinsFont } from "next/font/google";

const poppins = poppinsFont({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
});

export { poppins };