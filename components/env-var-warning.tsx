import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex items-center gap-3">
      <Badge variant={"outline"} className="rounded-md bg-amber-50 font-normal text-amber-800">
        Mode demo
      </Badge>
      <div className="hidden gap-2 xl:flex">
        <Button size="sm" variant={"outline"} disabled>
          Login
        </Button>
        <Button size="sm" variant={"default"} disabled>
          Daftar
        </Button>
      </div>
    </div>
  );
}
