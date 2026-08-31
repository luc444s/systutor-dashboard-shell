import { useQuery } from "@tanstack/react-query";

import { getSystemHealth, getSystemReady } from "./api";
import { Alert } from "@systutor/shell/ui/alert";
import { Badge } from "@systutor/shell/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@systutor/shell/ui/card";

export function SystemDashboardPage() {
  const healthQuery = useQuery({
    queryKey: ["system", "health"],
    queryFn: getSystemHealth,
  });

  const readyQuery = useQuery({
    queryKey: ["system", "ready"],
    queryFn: getSystemReady,
  });

  const hasError = healthQuery.error || readyQuery.error;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Estado del sistema, salud del backend y servicios conectados.
        </p>
      </div>

      {hasError ? (
        <Alert title="No se pudo cargar el estado del sistema">
          Revisa que el backend este levantado y que la API este disponible.
        </Alert>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API</CardTitle>
            <CardDescription>Estado basico de la API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow label="Estado" value={healthQuery.data?.status ?? "cargando"} />
            <MetricRow label="Servicio" value={healthQuery.data?.service ?? "-"} />
            <MetricRow label="Version" value={healthQuery.data?.version ?? "-"} />
            <MetricRow label="Entorno" value={healthQuery.data?.env ?? "-"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backend</CardTitle>
            <CardDescription>Conectividad y runtime del core.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow label="Base de datos" value={boolLabel(readyQuery.data?.database_connected)} />
            <MetricRow label="Redis" value={boolLabel(readyQuery.data?.redis_configured)} />
            <MetricRow label="Plugins" value={String(readyQuery.data?.plugins_loaded ?? 0)} />
            <MetricRow
              label="BD configurada"
              value={boolLabel(readyQuery.data?.database_configured)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/70 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge>{value}</Badge>
    </div>
  );
}

function boolLabel(value: boolean | undefined) {
  if (value === undefined) {
    return "cargando";
  }

  return value ? "ok" : "no";
}
