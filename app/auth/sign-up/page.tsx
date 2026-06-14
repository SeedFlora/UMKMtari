import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center bg-[url('/images/heritage-studio.png')] bg-cover bg-center p-6 md:p-10">
      <div className="absolute inset-0 bg-[hsl(var(--heritage-navy)/0.72)]" />
      <div className="w-full max-w-sm">
        <SignUpForm className="relative" />
      </div>
    </div>
  );
}
