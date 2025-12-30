
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { cookies } from "next/headers";

async function InstrumentsData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: instruments } = await supabase.from("PushNotifications").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading push...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
