import dynamic from "next/dynamic";

export default dynamic(() => import("./AuthProvider"), { ssr: false });
