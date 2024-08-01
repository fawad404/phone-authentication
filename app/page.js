import OtpLogin from "@/components/OtpLogin";


export default function Home() {
  return (
   <main className="text-center">
    <h1 className="font-bold text-center mb-5">
      How to Add One-Time Password Phone Authentication
    </h1>
    <OtpLogin />
   </main>
  );
}
