import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface NavigateProps {
  to: string;
  replace?: boolean;
}

export function Navigate({ to, replace = true }: NavigateProps) {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to, replace });
  }, [navigate, to, replace]);

  return null;
}
